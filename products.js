const { createApp } = Vue;
let proModal, delModal = '';
const app = createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2', // 請加入站點
      path: 'jasonfu-api-vuetest',// 請加入個人 API Path
      tempProduct: {},
      products: [],
      isNew: false,
    }
  },
  methods: {
    checkLoginToken() {
      axios.post(`${this.url}/api/user/check`)
        .then(res => {
          if (res.data.success) {
            // alert('驗證成功');
            this.renderProducts();
          }
        })
        .catch(err => {
          alert('請先登入');
          window.location.href = "./index.html"; //跳回登入頁
          console.dir(err.response.data.message);
        })
    },
    renderProducts() {  //call API get產品資訊
      axios.get(`${this.url}/api/${this.path}/admin/products`)
        .then(res => {
          this.products = res.data.products;
          // console.log(res);
        })
        .catch(err => {
          alert(err.response.data.message);
          console.dir(err.response.data.message);
        })
    },
    openModal(isNew, item) {
      if (isNew === 'new') { //開啟新增產品modal
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        proModal.show();
      }
      else if (isNew === 'edit') { //開啟編輯產品modal 深拷貝products的資料到tempProducts 因tempProduct有第二層屬性
        this.tempProduct = JSON.parse(JSON.stringify(item));
        this.isNew = false;
        proModal.show();
      }
      else if (isNew === 'delete') { //開啟刪除產品modal
        this.tempProduct = { ...item }
        delModal.show();
      }
    },
    checkImagesArray(){　//檢查tempProduct的imagesUrl陣列不為空白
      if(this.tempProduct.imagesUrl){
        this.tempProduct.imagesUrl = this.tempProduct.imagesUrl.filter(item => item !== '');  //篩選新增更多圖片的連結欄位不為空白 
      }
    },
    confirmProduct() {  //在productModal 按下確認後call API post產品資訊
      let url = `${this.url}/api/${this.path}/admin/product`;  //預設是新增產品的API
      let http = 'post';
      
      if (!this.tempProduct.id) {  //如果tempProduct中沒有id 則為新增產品
        this.checkImagesArray();
        axios[http](url, { data: this.tempProduct })
          .then(res => {
            this.renderProducts();
            alert(res.data.message);
            proModal.hide();
          })
          .catch(err => {
            alert(err.response.data.message);
            console.dir(err.response.data.message);
          });
      }
      else {   //如果tempProduct有id 則為編輯產品
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        http = 'put';
        
        this.products.forEach((item) => {
          if (item.id === this.tempProduct.id) {
            if (JSON.stringify(item) === JSON.stringify(this.tempProduct)) {  //如果編輯內容沒有任何改變 則return
              alert('No changes made!!');
              return;
            }
            else {  //call API put產品
              this.checkImagesArray();
              axios[http](url, { data: this.tempProduct })
                .then(res => {
                  alert(res.data.message);
                  this.renderProducts();
                  proModal.hide();
                })
                .catch(err => {
                  alert(err.response.data.message);
                  console.dir(err.response.data.message);
                })
            }
          }
        });
      }
    },
    confirmDel() { //確認刪除產品
      this.products.forEach((item) => {
        if (item.id === this.tempProduct.id) {
          axios.delete(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`)
            .then(res => {
              this.tempProduct = {};
              delModal.hide();
              this.renderProducts();
              alert(res.data.message);
            })
            .catch(err => {
              alert(err.response.data.message);
              console.dir(err.response.data.message);
            });
        }
      });
    },
    createImages() {  //新增更多圖片
      if (!this.tempProduct.imagesUrl) {  //如果imagesUrl不存在 則幫他創建一個陣列
        this.tempProduct.imagesUrl = [];
      }
      this.tempProduct.imagesUrl.push('');
    },
    delImages(index) { //刪除圖片
      this.tempProduct.imagesUrl.splice(index, 1);
    },
  },
  mounted() {
    // 取得cookie中的token ,並夾在headers中
    var token = document.cookie.replace(/(?:(?:^|.*;\s*)jasonToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
    axios.defaults.headers.common['Authorization'] = token;
    this.checkLoginToken();  //call登入驗證
    proModal = new bootstrap.Modal(document.querySelector('#productModal'));  //取得productModal的DOM元素
    delModal = new bootstrap.Modal(document.querySelector('#delProductModal')); //取得delProductModal的DOM元素
  }

});

app.mount('#app');

// this.tempProduct.imagesUrl.forEach((item, index) => {
//   if (item === '') {
//     this.tempProduct.imagesUrl.splice(index, 1); //如果新增更多圖片的連結欄位是空白的 則將建立圖片的空字串清除
//   }
// });