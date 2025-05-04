export function getUserAge(dob: string): number {
    const dateOfBirth = new Date(dob);
    const today = new Date();
    const month = today.getMonth() - dateOfBirth.getMonth();
    let age = today.getFullYear() - dateOfBirth.getFullYear();

    if (month < 0 || (month == 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
  