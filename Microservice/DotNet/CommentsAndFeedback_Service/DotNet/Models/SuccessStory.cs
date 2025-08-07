using System;
using System.Collections.Generic;

namespace CommentsAndFeedback_Service.Models;

public partial class SuccessStory
{
    public int SuccessId { get; set; }

    public string Updates { get; set; } = null!;

    public byte[]? Images { get; set; }

    public float? FundRaised { get; set; }
}
