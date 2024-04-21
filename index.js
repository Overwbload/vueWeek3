const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2', // 請加入站點
      path: 'jasonfu-api-vuetest',// 請加入個人 API Path
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    getLogin() {
      axios.post(`${this.url}/admin/signin`, this.user)
        .then(res => {
          const { token, expired, message } = res.data;  //取得API回傳的token&expired&message
          document.cookie = `jasonToken=${token}; expires=${new Date(expired)};`;  //將token&expired儲存至cookie  
          alert(message);
          window.location.href = "./products.html";  //頁面跳轉
        })
        .catch(err => {
          alert(err.response.data.message);
          console.dir(err.response);
        });
    },
  },
  mounted() {
  }
});

app.mount('#app');

