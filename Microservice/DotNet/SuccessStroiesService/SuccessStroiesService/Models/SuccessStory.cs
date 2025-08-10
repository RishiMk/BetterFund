using System;
using System.Collections.Generic;

namespace SuccessStories_service.Models;

public partial class SuccessStory
{
    public int SuccessId { get; set; }

    public int CampaignId { get; set; }

    public string? Updates { get; set; }

    public byte[]? Images { get; set; }

    public float? FundRaised { get; set; }

    public virtual Campaign Campaign { get; set; } = null!;
}
