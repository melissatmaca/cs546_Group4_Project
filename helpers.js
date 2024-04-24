export const generateRandomString = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
  
      for (let i = 0; i < 16; i++) {
          const randomIndex = Math.floor(Math.random() * letters.length);
          result = result + letters.charAt(randomIndex);
        }
  
      return result;
  };