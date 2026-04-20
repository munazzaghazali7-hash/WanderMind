export default function BookingSelection() {
  return (
    <div className="flex-1 flex flex-col p-8 items-center justify-center bg-surface/30">
      <div className="max-w-2xl text-center space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Booking Selection
        </h2>
        <p className="text-text-muted text-lg">
          Seamlessly book your flights, hotels, and activities directly from your generated itinerary.
        </p>
        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
          <p className="text-primary font-medium">Coming Soon</p>
          <p className="text-sm text-text-muted mt-2">Integration with Expedia and Booking.com APIs is in development.</p>
        </div>
      </div>
    </div>
  );
}
