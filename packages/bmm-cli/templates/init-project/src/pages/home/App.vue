<template>
  <div id="app">
    <div
      id="
      container"
    >
      <div id="nav">
        <router-link to="/">
          Home
        </router-link> |
        <router-link to="/about">
          About
        </router-link>
      </div>
      <router-view />
      <button v-on:click="showMsg">
        xxxx
      </button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'App',
  components: {
  },
  data: function () {
    return {
      baseSideControl: {
        top: {
          title: '交易管理',
          href: '/oms.html',
        },
        bases: [{
          title: '起草信用保障订单',
          href: '/draft-trusts.html',
        }, {
          title: '所有订单',
          href: '/oms.html',
        }],
        menus: [{
          title: '订单管理',
          items: [{
            title: '评价管理',
            href: '',
          }, {
            title: '退款管理',
            href: '/6666',
          }, {
            title: '运费模板',
            href: '',
          }, {
            title: '订单回收站',
            href: '',
          }],
        }, {
          title: '交易服务',
          items: [{
            title: '信用保障服务介绍',
            href: '',
          }, {
            title: '额度管理',
            href: '',
          }],
        }, {
          title: '增值服务',
          items: [{
            title: '验货服务',
            href: '',
          }, {
            title: '生产跟进服务',
            href: '',
          }, {
            title: '备货融资',
            href: '',
          }, {
            title: '无忧赊',
            href: '',
          }, {
            title: '尾款保障服务',
            href: '',
          }, {
            title: '信用证融资',
            href: '',

            items: [{
              title: '验货服务1',
              href: '',
            }],
          }],
        }],
      },
    }
  },
  methods: {
    confirm () {
      console.log('xxxxxxx')
    },
    discard () {
      console.log('discard')
    },
    cancelSketch () {
      console.log('cancel')
    },
    showMsg () {
      // showSketchMsg(this.confirm)
      this.$refs.BaseSketchModal.showModal()
    },
  },
  created(){
    console.log('init')
    
  }
}
</script>
<style lang="less">
#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
