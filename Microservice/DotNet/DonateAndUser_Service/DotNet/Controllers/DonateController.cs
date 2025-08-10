using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DonateAndUser_Service.Models;
using System;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class DonateController : ControllerBase
{
    private readonly P13CrowdfundingDbContext _context;

    public DonateController(P13CrowdfundingDbContext context)
    {
        _context = context;
    }

    [HttpPost("{campaignId}")]
    public async Task<IActionResult> DonateToCampaign(int campaignId, [FromBody] DonationRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest("Invalid donation amount.");

        // 🔹 Load campaign and wallet without tracking User entities
        var campaign = await _context.Campaigns
            .Include(c => c.Wallet)
            .AsNoTracking() // prevents tracking Campaign/User relationships
            .FirstOrDefaultAsync(c => c.CampaignId == campaignId);

        if (campaign == null)
            return NotFound("Campaign not found.");

        if (campaign.Wallet == null)
            return BadRequest("Campaign has no associated wallet.");

        if (campaign.Wallet.Amount + request.Amount > campaign.TargetAmt)
            return BadRequest("Donation exceeds target amount.");

        // 🔹 Create new donation record
        var donation = new Donation
        {
            Amount = request.Amount,
            Campaignid = campaign.CampaignId,
            WalletId = campaign.Wallet.WalletId,
            DonationTime = DateTime.Now
        };

        // 🛡️ Detach any tracked User entities before saving to avoid role changes
        var trackedUsers = _context.ChangeTracker.Entries<User>().ToList();
        foreach (var entry in trackedUsers)
        {
            entry.State = EntityState.Detached;
        }

        // 🔹 Attach wallet to context and update amounts
        _context.Wallets.Attach(campaign.Wallet);
        campaign.Wallet.Amount += request.Amount;
        campaign.Wallet.CurBalance += request.Amount;

        // 🔹 Save donation
        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Successfully donated ₹{request.Amount}" });
    }

}

public class DonationRequest
{
    public float Amount { get; set; }
}
