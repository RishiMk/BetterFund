using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using SuccessStories_service.Models;

namespace SuccessStories_service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuccessStoriesController : ControllerBase
    {
        private readonly P13CrowdfundingDbContext _context;
        public SuccessStoriesController(P13CrowdfundingDbContext context) => _context = context;

        /* ----------  GET ALL STORIES WITH IMAGE URL  ---------- */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var stories = await _context.SuccessStories
                .Include(s => s.Campaign)
                .ThenInclude(c => c.User) // Include User from Campaign
                .OrderByDescending(s => s.SuccessId) // Most recent first
                .Take(10) // Only 10 stories
                .Select(s => new
                {
                    s.SuccessId,
                    s.CampaignId,
                    CampaignTitle = s.Campaign.Title,
                    CampaignStartDate = s.Campaign.StartDate,
                    CampaignEndDate = s.Campaign.EndDate,
                    UserName = s.Campaign.User.Uname,
                    s.Updates,
                    s.FundRaised,
                    ImageURL = $"/api/successstories/image/{s.SuccessId}"
                })
                .ToListAsync();

            return Ok(stories);
        }

        /* ----------  GET ONE STORY BY ID  ---------- */
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SuccessStory>> GetById(int id) =>
            await _context.SuccessStories.FindAsync(id) is { } story
                ? story
                : NotFound();

        /* ----------  GET IMAGE BY STORY ID  ---------- */
        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var story = await _context.SuccessStories.FindAsync(id);
            if (story == null || story.Images == null || story.Images.Length == 0)
                return NotFound();

            return File(story.Images, "image/jpeg");
        }

        /* ----------  POST – CREATE SUCCESS STORY (Admin Only)  ---------- */
        [HttpPost]
        public async Task<ActionResult<SuccessStory>> Create(
            [FromForm] int campaignId,
            [FromForm] string updates,
            IFormFile? images)
        {
            if (string.IsNullOrWhiteSpace(updates))
                return BadRequest("Updates text is required.");

            // 1. Get campaign with donations
            var campaign = await _context.Campaigns
                .Include(c => c.Donations)
                .FirstOrDefaultAsync(c => c.CampaignId == campaignId);

            if (campaign == null)
                return NotFound("Campaign not found.");

            // 2. Check if campaign is completed
            if (!string.Equals(campaign.Status, "Completed", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Campaign is not completed yet.");

            // 3. Prevent duplicate story
            bool storyExists = await _context.SuccessStories
                .AnyAsync(s => s.CampaignId == campaignId);
            if (storyExists)
                return BadRequest("Success story already exists for this campaign.");

            // 4. Calculate total funds raised
            float totalFundRaised = campaign.Donations.Sum(d => d.Amount);

            // 5. Prepare image bytes
            byte[]? imgBytes = null;
            if (images is { Length: > 0 })
            {
                using var ms = new MemoryStream();
                await images.CopyToAsync(ms);
                imgBytes = ms.ToArray();
            }

            // 6. Create and save story
            var entity = new SuccessStory
            {
                CampaignId = campaign.CampaignId,
                Updates = updates,
                FundRaised = totalFundRaised,
                Images = imgBytes
            };

            _context.SuccessStories.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = entity.SuccessId }, entity);
        }

        [HttpGet("completed")]
        public async Task<ActionResult<IEnumerable<object>>> GetCompletedCampaigns()
        {
            var campaigns = await _context.Campaigns
                .Where(c => c.Status == "Completed"
                    && !_context.SuccessStories.Any(s => s.CampaignId == c.CampaignId))
                .Select(c => new    
                {
                    c.CampaignId,
                    c.Title
                })
                .ToListAsync();

            return Ok(campaigns);
        }

        /* ----------  DELETE STORY BY ID  ---------- */
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var story = await _context.SuccessStories.FindAsync(id);
            if (story == null) return NotFound();

            _context.SuccessStories.Remove(story);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
