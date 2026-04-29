import { useState } from 'react';
import { Calendar, Clock, Video, MapPin, Eye, ChevronLeft, ChevronRight, User, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCounselors, Counselor } from '../hooks/useCounselors';
import { useAuth } from '../hooks/useAuth';
import emailjs from '@emailjs/browser';

interface TimeSlot {
  time: string;
  available: boolean;
}



interface Appointment {
  id: string;
  counselor: string;
  date: string;
  time: string;
  mode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingCode: string;
}

export function BookingSystem() {
  const { user, profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState('online');
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: false },
    { time: '5:00 PM', available: true },
  ];
  const initialCounselors: Counselor[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      title: 'Clinical Psychologist',
      specialties: ['Anxiety', 'Depression', 'Stress Management'],
      rating: 4.9,
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Amit Singh',
      title: 'Cognitive Behavioral Therapist',
      specialties: ['OCD', 'Trauma', 'Phobias'],
      rating: 4.8,
      isOnline: false
    },
    {
      id: '3',
      name: 'Neha Gupta',
      title: 'Student Wellness Counselor',
      specialties: ['Academic Stress', 'Career Counseling', 'Time Management'],
      rating: 4.7,
      isOnline: true
    }
  ];

  const { counselors, loading } = useCounselors(initialCounselors);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      counselor: 'Dr. Priya Sharma',
      date: 'May 15, 2026',
      time: '2:00 PM',
      mode: 'Online',
      status: 'upcoming',
      bookingCode: 'MC-2026-001',
    },
    {
      id: '2',
      counselor: 'Dr. Amit Singh',
      date: 'June 10, 2026',
      time: '11:00 AM',
      mode: 'In-Person',
      status: 'completed',
      bookingCode: 'MC-2026-002',
    },
  ]);

  const getWeekDays = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (weekOffset * 7)));
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const handleBookAppointment = async () => {
    if (selectedTime && selectedCounselor) {
      setIsBooking(true);
      const bookingCode = `MC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        counselor: selectedCounselor.name,
        date: formatDate(selectedDate),
        time: selectedTime,
        mode: selectedMode === 'online' ? 'Online' : selectedMode === 'in-person' ? 'In-Person' : 'Anonymous',
        status: 'upcoming',
        bookingCode: bookingCode
      };

      const userEmail = profile?.email || user?.email;
      const userName = profile?.displayName || user?.displayName || 'Student';

      if (userEmail && userEmail !== 'guest@example.com') {
        try {
          const templateParams = {
            to_name: userName,
            to_email: userEmail,
            counselor_name: selectedCounselor.name,
            booking_date: formatDate(selectedDate),
            booking_time: selectedTime,
            booking_mode: selectedMode,
            booking_code: bookingCode
          };

          // Send confirmation via EmailJS
          await emailjs.send(
            'service_6y29m8k',
            'template_tz4uy8h',
            templateParams,
            'TIJB_ZodGmdSKcUvn'
          );
          console.log('Confirmation email sent successfully!');
        } catch (error) {
          console.error('Failed to send confirmation email:', error);
          // We still show confirmation even if email fails, so they know it booked
        }
      } else {
        console.log('No valid email found or guest user. Skipping email confirmation.');
      }

      setAppointments(prev => [newAppointment, ...prev]);
      setConfirmedAppointment(newAppointment);
      setIsBooking(false);
      setShowConfirmation(true);
    }
  };

  const weekDays = getWeekDays(currentWeek);

  if (showConfirmation && confirmedAppointment) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center" style={{ background: 'var(--theme-bg-gradient)' }}>
        <Card 
          className="max-w-md w-full backdrop-blur-sm border-0 shadow-xl transition-colors duration-300"
          style={{ backgroundColor: 'var(--theme-card-bg)' }}
        >
          <CardHeader className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-secondary)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--icon-primary)' }} />
            </div>
            <CardTitle className="font-['Poppins'] text-2xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
              Booking Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="rounded-lg p-4 space-y-3 transition-colors duration-300 border"
              style={{ backgroundColor: 'var(--theme-bg-primary)', borderColor: 'var(--theme-border)' }}
            >
              <h3 className="font-['Poppins'] font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                Appointment Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Counselor:</span>
                  <span className="font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>{confirmedAppointment.counselor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Date:</span>
                  <span className="font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>{confirmedAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Time:</span>
                  <span className="font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>{confirmedAppointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Mode:</span>
                  <span className="font-medium capitalize transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>{confirmedAppointment.mode}</span>
                </div>
                <div className="flex justify-between border-t pt-2" style={{ borderColor: 'var(--theme-border)' }}>
                  <span className="transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Booking Code:</span>
                  <span className="font-bold" style={{ color: 'var(--theme-primary)' }}>{confirmedAppointment.bookingCode}</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                You'll receive a confirmation email with session details shortly.
              </p>
              <Button
                onClick={() => setShowConfirmation(false)}
                className="w-full bg-[#6C63FF] hover:bg-[#5b54d9] text-white"
              >
                Back to Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--theme-bg-gradient)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1
                className="font-['Poppins'] font-semibold text-3xl transition-colors duration-300"
                style={{ color: 'var(--theme-text-primary)' }}
              >
                Book a Session
              </h1>
              <p
                className="transition-colors duration-300"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                Schedule a confidential session with one of our qualified counselors
              </p>
            </div>

            {/* Calendar */}
            <Card
              className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300"
              style={{ backgroundColor: 'var(--theme-card-bg)' }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle
                    className="font-['Poppins'] text-xl transition-colors duration-300"
                    style={{ color: 'var(--theme-text-primary)' }}
                  >
                    Select Date
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(currentWeek - 1)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                    return (
                      <button
                        key={index}
                        onClick={() => !isPast && setSelectedDate(day)}
                        disabled={isPast}
                        className={`p-3 rounded-lg text-center transition-all duration-200 ${isPast
                          ? 'opacity-30 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#6C63FF] text-white shadow-md'
                            : isToday
                              ? 'bg-[#A7D8FF] text-gray-800'
                              : 'hover:opacity-70'
                          }`}
                        style={{
                          color: (isSelected || isToday || isPast) ? undefined : 'var(--theme-text-primary)'
                        }}
                      >
                        <div className="text-xs opacity-75">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="font-medium">
                          {day.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg-elevated)' }}>
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                  Available Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg text-center border transition-all duration-200 ${!slot.available
                        ? 'opacity-40 cursor-not-allowed border-transparent'
                        : selectedTime === slot.time
                          ? 'bg-[#6C63FF] text-white shadow-md border-transparent'
                          : 'hover:border-[#6C63FF]'
                        }`}
                      style={{
                        backgroundColor: selectedTime === slot.time ? undefined : 'var(--theme-bg-primary)',
                        color: selectedTime === slot.time ? undefined : 'var(--theme-text-primary)',
                        borderColor: selectedTime === slot.time ? undefined : 'var(--theme-border)'
                      }}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-medium">{slot.time}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Mode */}
            <Card className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg-elevated)' }}>
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                  Session Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMode} onValueChange={setSelectedMode}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className="flex items-center space-x-2 p-4 rounded-lg border hover:border-[#6C63FF] transition-colors duration-200"
                      style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }}
                    >
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Video className="w-5 h-5 text-[#6C63FF]" />
                          <div>
                            <div className="font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>Online</div>
                            <div className="text-xs transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Video call session</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div 
                      className="flex items-center space-x-2 p-4 rounded-lg border hover:border-[#6C63FF] transition-colors duration-200"
                      style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }}
                    >
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-[#00BFA6]" />
                          <div>
                            <div className="font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>In-Person</div>
                            <div className="text-xs transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Office visit</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div 
                      className="flex items-center space-x-2 p-4 rounded-lg border hover:border-[#6C63FF] transition-colors duration-200"
                      style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }}
                    >
                      <RadioGroupItem value="anonymous" id="anonymous" />
                      <Label htmlFor="anonymous" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Eye className="w-5 h-5 text-[#A7D8FF]" />
                          <div>
                            <div className="font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>Anonymous</div>
                            <div className="text-xs transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>Private session</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Counselor Selection */}
            <Card className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg-elevated)' }}>
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                  Choose Your Counselor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">Loading counselors...</div>
                ) : (
                  <div className="space-y-4">
                    {counselors.map((counselor) => (
                      <div
                        key={counselor.id}
                        onClick={() => setSelectedCounselor(counselor)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedCounselor?.id === counselor.id
                          ? 'border-[#6C63FF] bg-[#6C63FF]/10'
                          : 'hover:border-[#6C63FF]/50'
                          }`}
                        style={{
                          backgroundColor: selectedCounselor?.id === counselor.id ? undefined : 'var(--theme-bg-primary)',
                          borderColor: selectedCounselor?.id === counselor.id ? undefined : 'var(--theme-border)'
                        }}
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-r from-[#6C63FF] to-[#A7D8FF] text-white">
                              {counselor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-['Poppins'] font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                                {counselor.name}
                              </h3>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm font-medium">{counselor.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm mb-2 transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{counselor.title}</p>
                            <div className="flex flex-wrap gap-1">
                              {counselor.specialties?.map((specialty) => (
                                <Badge
                                  key={specialty}
                                  className="bg-[#E8F5E8] text-[#00BFA6] border-0 text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Book Button */}
            <Button
              onClick={handleBookAppointment}
              disabled={!selectedTime || !selectedCounselor || isBooking}
              className="w-full py-3 bg-[#00BFA6] hover:bg-[#00a693] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBooking ? 'Sending Confirmation...' : 'Book Appointment'}
            </Button>
          </div>

          {/* Right Sidebar - My Appointments */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm border-0 shadow-lg transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg-elevated)' }}>
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-xl transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                  My Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 rounded-lg border transition-colors duration-300"
                      style={{ 
                        backgroundColor: 'var(--theme-bg-primary)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={`border-0 ${appointment.status === 'upcoming'
                            ? 'bg-[#E8F5E8] text-[#00BFA6]'
                            : appointment.status === 'completed'
                              ? 'bg-gray-500/10 text-gray-400'
                              : 'bg-red-500/10 text-red-500'
                            }`}
                        >
                          {appointment.status}
                        </Badge>
                        <span className="text-xs transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                          {appointment.bookingCode}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1 transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                        {appointment.counselor}
                      </h4>
                      <div className="text-sm space-y-1 transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {appointment.mode === 'Online' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          <span>{appointment.mode}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-gradient-to-r from-[#6C63FF]/10 to-[#A7D8FF]/10 border-0">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[#6C63FF] to-[#A7D8FF] rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" style={{ color: 'var(--icon-primary)' }} />
                </div>
                <h3 className="font-['Poppins'] font-medium transition-colors duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                  Confidential & Secure
                </h3>
                <p className="text-sm transition-colors duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                  All sessions are completely confidential and secure. Your privacy is our priority.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}