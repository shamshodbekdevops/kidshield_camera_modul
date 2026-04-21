// Kelajakda haqiqiy server (backend) ulanadigan qismi
// Hozirda bu tizim barcha foydalanuvchilar bilan ishlashni vaqtincha taqlid qiladi (Mock API)

const MOCK_USERS = {
  tarbiyachi: {
    expectedLogin: 'Tarbiyachi',
    expectedPass: '1234',
    userData: {
      id: '1',
      fullName: 'Aziza Karimova',
      email: 'aziza.k@bogcha.uz',
      role: 'tarbiyachi',
      groupId: 'group-1'
    }
  },
  mudir: {
    expectedLogin: 'Mudir',
    expectedPass: '1234',
    userData: {
      id: '2',
      fullName: 'Dilorom Rashidova',
      email: 'mudir@bogcha.uz',
      role: 'mudir',
      groupId: null
    }
  },
  security: {
    expectedLogin: 'Qorovul',
    expectedPass: '1234',
    userData: {
      id: '3',
      fullName: 'Akmal Abdullayev',
      email: 'security@bogcha.uz',
      role: 'security',
      groupId: null
    }
  }
};

/**
 * Tizimga kirish bo'yicha yolg'on (Mock) API so'rovi
 * @param {string} role 'tarbiyachi' | 'mudir' | 'security'
 * @param {string} login Kiritilgan login
 * @param {string} password Kiritilgan parol
 * @returns Promise
 */
export const loginApi = async (role, login, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockSettings = MOCK_USERS[role];
      if (!mockSettings) {
        return reject(new Error("Bunday darajadagi foydalanuvchi topilmadi!"));
      }

      const normalizedLogin = login.trim().toLowerCase();
      const expectedNormalized = mockSettings.expectedLogin.toLowerCase();

      if (normalizedLogin === expectedNormalized && password === mockSettings.expectedPass) {
        resolve({ success: true, user: mockSettings.userData });
      } else {
        reject(new Error("Login yoki parol nato'g'ri kitirildi!"));
      }
    }, 800); // 800ms serverga ulanish jarayonini taqlid qilish
  });
};
