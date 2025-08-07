using System;
using System.Collections.Generic;

namespace SuccessStories_service.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string? Cname { get; set; }

    public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
}
