namespace TravelMapGuide.Server.Models.Payment
{
    public class PaymentRequestModel
    {
        public string CardNumber { get; set; }
        public string CardHolderName { get; set; }
        public string ExpireMonth { get; set; }
        public string ExpireYear { get; set; }
        public string Cvc { get; set; }
        public decimal Price { get; set; }
        public string TravelId { get; set; }
    }
}
