using System;
using System.Collections.Generic;

namespace DonateAndUser_Service.Models;

public partial class Document
{
    public int DocumentId { get; set; }

    public int? CampaignId { get; set; }

    public byte[]? Documents { get; set; }

    public string? ContentType { get; set; }

    public string? FileName { get; set; }

    public virtual Campaign? Campaign { get; set; }

    public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
}
