using AutoMapper;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.Mappings.AutoMapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserRegisterModel>().ReverseMap();
        }
    }
}
