using AutoMapper;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Models;

namespace TravelMapGuide.Server.Mappings.AutoMapper
{
    public class TravelProfile : Profile
    {
        public TravelProfile()
        {
            CreateMap<Travel, CreateTravelModel>().ReverseMap();
            CreateMap<Travel, UpdateTravelModel>().ReverseMap();
            CreateMap<Travel, Travel>().ReverseMap();
        }
    }
}
