<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
		<!-- 	<uni-forms-item name="menu_id" label="" required>
				<uni-easyinput placeholder="菜单项的ID，不可重复" v-model="formData.menu_id" trim="both" />
			</uni-forms-item> -->
			<uni-forms-item name="name" label="菜单名称" required>
				<uni-easyinput placeholder="菜单名称" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="icon" label="菜单图标">
				<uni-easyinput placeholder="菜单图标" v-model="formData.icon" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="link_url" label="菜单跳转url">
				<uni-easyinput placeholder="菜单跳转url" v-model="formData.link_url" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="sort" label="菜单排序">
				<uni-easyinput placeholder="菜单序号（越大越靠后）" type="number" v-model="formData.sort" />
			</uni-forms-item>
		<!-- 	<uni-forms-item name="parent_id" label="父级菜单Id">
				<uni-easyinput placeholder="父级菜单Id" v-model="formData.parent_id" />
			</uni-forms-item> -->
			<uni-forms-item name="parent_id" label="父级菜单">
			     <!--  <uni-easyinput placeholder="父级菜单Id" v-model="formData.parent_id"></uni-easyinput>
			-->
				 <unicloud-db collection="portal-menus" field="menu_id as value ,name as text " :where="`parent_id ==''`"
				 v-slot:default="{data,pagination,loading,error,options}" >
				 <uni-data-checkbox v-model="formData.parent_id" :localdata="data"> </uni-data-checkbox>
				   <!-- <uni-data-checkbox v-model="formData.parent_id" :localdata="formOptions.menu_type_localdata"></uni-data-checkbox> -->
				</unicloud-db>

			</uni-forms-item>


		<!-- 	<uni-forms-item name="permission" label="">
				<uni-data-checkbox :multiple="true" v-model="formData.permission" />
			</uni-forms-item> -->
			<uni-forms-item name="description" label="描述">
				<uni-easyinput placeholder="描述" v-model="formData.description" />
			</uni-forms-item>

			<uni-forms-item name="enable" label="是否启用">
				<switch @change="binddata('enable', $event.detail.value)" :checked="formData.enable" />
			</uni-forms-item>


			<uni-forms-item name="menu_type" label="菜单类型">
				<uni-data-checkbox v-model="formData.menu_type" :localdata="formOptions.menu_type_localdata" />
			</uni-forms-item>
			<uni-forms-item name="link_type" label="跳转链接类型">
				<uni-data-checkbox v-model="formData.link_type" :localdata="formOptions.link_type_localdata" />
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
	import {
		validator
	} from '../../js_sdk/validator/portal-menus.js';

    const uuid =require('uuid').v4()
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'portal-menus';

	function getValidator(fields) {
		let reuslt = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				reuslt[key] = validator[key]
			}
		}
		return reuslt
	}

	export default {
		data() {
			return {
				formData: {
					"menu_id": "",
					"name": "",
					"icon": "",
					"link_url": "",
					"sort": 10,
					"parent_id": "",
					"permission": [],
					"description": "",
					"enable": true,
					"menu_type": 1,
					"link_type": 1
				},
				formOptions: {
					"menu_type_localdata": [{
							"text": "首页导航",
							"value": 1
						},
						{
							"text": "TOP菜单",
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
					"link_type_localdata": [{
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
					...getValidator(["menu_id", "name"
					])
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
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

				value.menu_id = uuid
				console.log('uuid', uuid)
				console.log('value:', value)
				// 使用 clientDB 提交数据
				db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
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
