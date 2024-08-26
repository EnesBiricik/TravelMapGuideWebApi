using AutoMapper;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.Mappings.AutoMapper
{
    public class TravelProfile : Profile
    {
        public TravelProfile()
        {
            CreateMap<Travel, CreateTravelModel>().ReverseMap();
            CreateMap<Travel, UpdateTravelModel>().ReverseMap();
            CreateMap<Travel, Travel>().ReverseMap(); //listModel ? mb
        }
    }
}
