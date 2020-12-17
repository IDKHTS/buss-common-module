<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../../../assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button v-on:click="clickFn">
      dialog
    </button>
    <br>
    <button v-on:click="clickModal">
      modal
    </button>
    <input
      type="file"
      accept="image/png,image/gif,image/jpeg"
      @change="update"
    >
    <br>
    <button v-on:click="onShowBaseGoodsModal">
      showBaseGoodsModal
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    // BaseModal,
  },
  data: function () {
    return {
      showBaseGoodsModal: false,
      tip: '您最多可选择50件商品参与本次优惠活动',
    }
  },
  methods: {
    clickFn () {
      const msg = 'msg'
      this.$refs.BaseDialog.msg(msg)
    },
    clickModal () {
      // const msg = '[Home]msg'
      // const errMsg = 'errMsg'
      // this.$refs.BaseModal.alert(msg, errMsg)
    },
    onShowBaseGoodsModal () {
      // this.showBaseGoodsModal = true
    },
    confirm (e) {
      console.log('confirm, %o', e)
    },
  },
}
</script>
