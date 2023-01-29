<template>
  <div class="full-loading">
    <div class="loadingio-spinner-dual-ring-sbpqckych4o">
      <div class="ldio-jbi2mj5x3qe">
        <div/>
        <div>
          <div/>
        </div>
      </div>
    </div>
    <div class="loading-text font-bold text-white mt-5">Loading...</div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="scss">
  .full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;
    text-align: center;
    width: 100%;
    height: 100%;
    background-color: #BBDEFB;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;

    .loading-text {
      font-size: 32px;
    }

    @keyframes ldio-jbi2mj5x3qe {
      0% { transform: rotate(0) }
      100% { transform: rotate(360deg) }
    }
    .ldio-jbi2mj5x3qe div { box-sizing: border-box!important }
    .ldio-jbi2mj5x3qe > div {
      position: absolute;
      width: 144px;
      height: 144px;
      top: 28px;
      left: 28px;
      border-radius: 50%;
      border: 16px solid #000;
      border-color: #ffffff transparent #ffffff transparent;
      animation: ldio-jbi2mj5x3qe 1.5s linear infinite;
    }
    .ldio-jbi2mj5x3qe > div:nth-child(2) { border-color: transparent }
    .ldio-jbi2mj5x3qe > div:nth-child(2) div {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotate(45deg);
    }
    .ldio-jbi2mj5x3qe > div:nth-child(2) div:before, .ldio-jbi2mj5x3qe > div:nth-child(2) div:after { 
      content: "";
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      top: -16px;
      left: 48px;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 128px 0 0 #ffffff;
    }
    .ldio-jbi2mj5x3qe > div:nth-child(2) div:after { 
      left: -16px;
      top: 48px;
      box-shadow: 128px 0 0 0 #ffffff;
    }
    .loadingio-spinner-dual-ring-sbpqckych4o {
      width: 200px;
      height: 200px;
      display: inline-block;
      overflow: hidden;
      background: none;
    }
    .ldio-jbi2mj5x3qe {
      width: 100%;
      height: 100%;
      position: relative;
      transform: translateZ(0) scale(1);
      backface-visibility: hidden;
      transform-origin: 0 0; /* see note above */
    }
    .ldio-jbi2mj5x3qe div { box-sizing: content-box; }
  }
</style>