<template>
  <div class="common-layout">
    <router-view />
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'CommonLayout',
}
</script>

<style scoped lang="less">
.common-layout{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: #f0f0f0;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;
  .content{
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px){

      padding: 112px 0 24px;
    }
  }
}
</style>
