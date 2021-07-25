<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
    <!--  <uni-forms-item name="menu_id" label="菜单ID" required  >
        <uni-easyinput placeholder="菜单项的ID，不可重复"  v-model="formData.menu_id" trim="both"></uni-easyinput>
      </uni-forms-item> -->
      <uni-forms-item name="name" label="菜单名称" required>
        <uni-easyinput placeholder="菜单名称" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="icon" label="菜单图标">
      <!--  <uni-easyinput placeholder="菜单图标" v-model="formData.icon" trim="both"></uni-easyinput> -->

		<uni-group title="">
			<view class="custom-image-box">
				<text class="text">选择图片</text>
				<uni-file-picker limit="1" :del-icon="false"  :imageStyles="imageStyles" file-mediatype="image"
				 @success="success" :src="formData.icon"
				>选择</uni-file-picker>
				<img    width="200px" height="200px" :src="formData.icon">
			</view>
		</uni-group>
      </uni-forms-item>
      <uni-forms-item name="link_url" label="菜单跳转url">
        <uni-easyinput placeholder="菜单跳转url" v-model="formData.link_url" trim="both"></uni-easyinput>
      </uni-forms-item>

  <!--    <uni-forms-item name="sort" label="">
        <uni-easyinput placeholder="菜单序号（越大越靠后）" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item> -->
      <uni-forms-item name="menu_type" label="菜单类型">
        <uni-data-checkbox v-model="formData.menu_type" :localdata="formOptions.menu_type_localdata"></uni-data-checkbox>
      </uni-forms-item>

      <uni-forms-item name="parent_id" label="父级菜单">
      <!--  <uni-easyinput placeholder="父级菜单Id" v-model="formData.parent_id"></uni-easyinput>
 -->
		 <unicloud-db collection="std-menus" field="menu_id as value ,name as text " :where="`parent_id ==''`"
		 v-slot:default="{data,pagination,loading,error,options}" >
		 <uni-data-checkbox v-model="formData.parent_id" :localdata="data"> </uni-data-checkbox>
		   <!-- <uni-data-checkbox v-model="formData.parent_id" :localdata="formOptions.menu_type_localdata"></uni-data-checkbox> -->
		</unicloud-db>

      </uni-forms-item>

    <!--  <uni-forms-item name="permission" label="">
        <uni-data-checkbox :multiple="true" v-model="formData.permission"></uni-data-checkbox>
      </uni-forms-item> -->
      <!-- <uni-forms-item name="enable" label="">
        <switch @change="binddata('enable', $event.detail.value)" :checked="formData.enable"></switch>
      </uni-forms-item> -->
   <!--   <uni-forms-item name="create_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item> -->
      <uni-forms-item name="link_type" label="跳转链接类型">
        <uni-data-checkbox v-model="formData.link_type" :localdata="formOptions.link_type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
            <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/std-menus.js';

  const uuid =require('uuid').v4()

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'std-menus';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }
  var imageUrl =''
  export default {
    data() {
      let formData = {
        "menu_id": "",
        "name": "",
        "icon": "",
        "link_url": "",
        "sort": null,
        "parent_id": "",
        "permission": [],
        "enable": true,
        "create_date": null,
        "menu_type": 1,
        "link_type": 1
      }
      return {
        formData,
        formOptions: {
          "menu_type_localdata": [
            {
              "text": "医生主页菜单",
              "value": 1
            },
            {
              "text": "问医菜单",
              "value": 2
            },
            {
              "text": "活动专区",
              "value": 3
            },
            {
              "text": "我的",
              "value": 4
            },
            {
              "text": "其他",
              "value": 5
            }
          ],
          "link_type_localdata": [
            {
              "text": "内链",
              "value": 1
            },
            {
              "text": "外链",
              "value": 2
            },
            {
              "text": "小程序",
              "value": 3
            },
            {
              "text": "APP",
              "value": 4
            },
            {
              "text": "其他",
              "value": 5
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        },
		imageStyles: {
			width: 64,
			height: 64,
			border: {
				radius: '50%'
			}
		},
		listStyles: {
			// 是否显示边框
			border: true,
			// 是否显示分隔线
			dividline: true,
			// 线条样式
			borderStyle: {
				width: 1,
				color: 'blue',
				style: 'dashed',
				radius: 2
			}
		},
		fileLists: [{
			url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg',
			extname: 'png',
			name: 'shuijiao.png'
		}, {
			url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg',
			extname: 'png',
			name: 'uniapp-logo.png'
		}, {
			url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg',
			extname: 'png',
			name: 'shuijiao.png'
		}]
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {


       // 获取上传状态
		select(e){
			console.log('选择文件：',e)
		},
		// 获取上传进度
		progress(e){
			console.log('上传进度：',e)
		},

		// 上传成功
		success(e){

	    imageUrl = e.tempFilePaths[0]
		console.log('上传成功：',e.tempFilePaths[0])
		console.log('uuid',uuid)
		},
		// 上传失败
		fail(e){
			console.log('上传失败：',e)
		},
      /**
       * 触发表单提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          this.submitForm(res)
        }).catch(() => {

          uni.hideLoading()
        })
      },

      submitForm(value) {
		console.log('icon:',imageUrl)
		value.icon = imageUrl
		value.menu_id = uuid
		console.log('value:',value)
		/* value.setIcon(url) */
        // 使用 clientDB 提交数据
        db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
         /* setTimeout(() => uni.navigateBack(), 500) */
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
<style>
	@charset "UTF-8";

	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url("~@/static/uni.ttf") format("truetype");
	}

	/* #endif */
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;

		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}


	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #007AFF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}

	.custom-image-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.text {
		font-size: 14px;
		color: #333;
	}
</style>
