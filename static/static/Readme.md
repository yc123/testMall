#资源文件

css/								#样式
	index.css						#首页样式
	salecenter.css					#卖家中心样式
	offer.css						#器件分类、定义及发布界面样式

js/									#应用
	common/							#基础应用
		directives/					#angularjs自定义指令
			ui-form.js				#表单相关指令
		controllers.js				#基础控制层
		directives.js				#基本指令
		services.js					#基础服务
		ui-jquery.js				#集成jquery的指令
		utils.js					#工具
	main/							#首页应用
	prod/							#器件相关应用
		controllers/				#器件相关界面控制层
		app.js						#器件界面综合应用及路由规则等
		main.js						#器件界面文件加载路径配置
	sale/							#卖家应用
		admin/						#卖家中心综合应用
		
lib/								#第三方库
	angular/						#angular及其插件库
	bootstrap/						#twitter bootstrap样式
	codemirror/						#文本编辑器summernote依赖库
	fontawesome/					#font-awesome矢量字体图标库
	jquery/							#jquery工具及其插件
	i18n.js							#angularjs国际化插件
	require.js						#js加载工具
	
misc/								#flash插件

nls/								#语言包
	en-US/							#英文包
	zh-TW/							#中文繁体
	lang.js							#默认语言（简体中文）
	
view/								#视图
	common/							#通用视图
		header.html					#界面抬头
	prod/							#器件模块视图
		product_brand_view.html		#品牌展示
		product_brand.html			#品牌定义
		product_category.html		#器件定义第一步：选择分类
		product_info.html			#器件定义
		product_kind.html			#器件分类定义、编辑
		product_manager.html		#器件分类属性编辑
	