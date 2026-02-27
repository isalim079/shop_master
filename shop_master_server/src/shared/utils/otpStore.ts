interface OtpRecord {
  otp: string;
  name: string;
  hashedPassword: string;
  expiresAt: Date;
}

const otpStore = new Map<string, OtpRecord>();

export const saveOtp = (
  email: string,
  otp: string,
  name: string,
  hashedPassword: string,
  expiresInMinutes: number
): void => {
  otpStore.set(email, {
    otp,
    name,
    hashedPassword,
    expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
  });
};

export const getOtp = (email: string): OtpRecord | undefined => {
  return otpStore.get(email);
};

export const deleteOtp = (email: string): void => {
  otpStore.delete(email);
};