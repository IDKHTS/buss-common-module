<template>
  <div id="app">
    <div
      id="
      container"
    >
      <div id="nav">
        <router-link to="/">
          Home
        </router-link>
        |
        <router-link to="/about">
          About
        </router-link>
      </div>
      <p>你好, {{ usr }}</p>
      <p>
        是否预览模式, {{ isPreviewMode }}
        <br />
        <span v-if="isPreviewMode">
          当前用户:{{ currUser }}
          <br />
          登录用户:{{ loginUser }}
        </span>
      </p>

      <router-view />
    </div>
  </div>
</template>
<script>
import { isDoneInit, GlobalData } from "bmm-config-init";
export default {
  name: "App",
  components: {},
  data: function() {
    return {
      usr: "",
      isPreviewMode: false,
      currUser: "",
      loginUser: ""
    };
  },
  created() {
    console.log("init");
    isDoneInit().then(() => {
      console.log(GlobalData);
      this.usr = GlobalData.DSSX.currUser.usr.attrs.basic.nickName;
      this.isPreviewMode = GlobalData.DSSX.attr.isPreviewMode;
      this.currUser = GlobalData.DSSX.currUser.usr.attrs.basic.nickName;
      this.loginUser = GlobalData.DSSX.uinfo.usr.attrs.basic.nickName;
      console.log(this.usr);
    });
  }
};
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
