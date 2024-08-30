using AutoMapper;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Models;

namespace TravelMapGuide.Server.Mappings.AutoMapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UpdateUserModel>().ReverseMap();
        }
    }
}
