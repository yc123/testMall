define([ 'ngResource' ], function() {
angular.module('urlencryptionServices', [ 'ngResource' ]).factory('EncryptionService', ['$modal', function($modal){
	/*
	*功能：对url加密算法（只针对window.location.href或则GET请求跳转，不针对post表单提交及ajax方式）
	*算法：对于暴露在浏览器地址栏中的属性值进行加密，如一个属性为agentID=1，
	*     若对1加密后为k230101io934jksd32r4，说明如下：
	*     前三位为随机数；
	*     第四到第五位为要加密字符转换成16进制的位数，
	*       如：要加密字符为15转换成16进制为f，位数为1，则第四、五位为01；
	*     第六位标识要加密字符为何种字符，0：纯数字，1：字符
	*       若是字符和数字的混合，则不加密；
	*     从第七位开始为16进制转换后的字符（字母和非数字先转换成asc码）；
	*     若加密后的字符总位数不足20位，则用随机数补齐到20位，若超出20位，则不加随机数。
	*     即加密后总位数至少为20位。
	*/
		return {
			encry : function(str) {
				var encryptStr = "";// 最终返回的加密后的字符串
				// 产生三位随机数
				var num = "";
				for (var i = 0; i < 3; i++) {
					num += Math.floor(Math.random() * 10);
				}
				encryptStr += num;// 产生3位随机数

				// 16位加密
				var tempspit = "";
				var strspit = angular.lowercase(str.toString());
				if (strspit.match(/^[-+]?\d*$/) == null) {// 非整数字符，对每一个字符都转换成16进制，然后拼接
					var s = strspit.split("");
					for (var i = 0; i < s.length; i++) {
						s[i] = s[i].charCodeAt();// 先转换成Unicode编码
						s[i] = s[i].toString(16);
						tempspit = tempspit + s[i];
					}
					tempspit = tempspit + "{" + 1;// 1代表字符
				} else {// 数字直接转换成16进制
					strspit = parseInt(strspit)
							.toString(16);
					tempspit = strspit + "{" + 0// 0代表纯数字
				}

				var temp = tempspit.split("{");// 对要加密的字符转换成16进制
				var numLength = temp[0].length;// 转换后的字符长度
				numLength = numLength.toString(16);// 字符长度换算成16进制
				if (numLength.length == 1) {// 如果是1，补一个0
					numLength = "0" + numLength;
				} else if (numLength.length > 3) {// 转换后的16进制字符长度如果大于2位数，则返回，不支持
					return "";
				}
				encryptStr += numLength;
				if (temp[1] == "0") {
					encryptStr += 0;
				} else if (temp[1] == "1") {
					encryptStr += 1;
				}
				encryptStr += temp[0];
				if (encryptStr.length < 20) {// 如果小于20位，补上随机数
					// 产生三位随机数
					var numtwo = "";
					for (var i = 0; i < 20 - encryptStr.length; i++) {
						numtwo += Math.floor(Math.random() * 10);
					}
					var ran = numtwo;//产生3位随机数
					encryptStr += ran;
				}
				return encryptStr;
			}
		};
	}]).filter('EncryptionFilter', function(){
		/*
		*功能：对url加密算法（只针对window.location.href或则GET请求跳转，不针对post表单提交及ajax方式）
		*算法：对于暴露在浏览器地址栏中的属性值进行加密，如一个属性为agentID=1，
		*     若对1加密后为k230101io934jksd32r4，说明如下：
		*     前三位为随机数；
		*     第四到第五位为要加密字符转换成16进制的位数，
		*       如：要加密字符为15转换成16进制为f，位数为1，则第四、五位为01；
		*     第六位标识要加密字符为何种字符，0：纯数字，1：字符
		*       若是字符和数字的混合，则不加密；
		*     从第七位开始为16进制转换后的字符（字母和非数字先转换成asc码）；
		*     若加密后的字符总位数不足20位，则用随机数补齐到20位，若超出20位，则不加随机数。
		*     即加密后总位数至少为20位。
		*/
			return function(str) {
					if(str) {
						var encryptStr = "";// 最终返回的加密后的字符串
						// 产生三位随机数
						var num = "";
						for (var i = 0; i < 3; i++) {
							num += Math.floor(Math.random() * 10);
						}
						encryptStr += num;// 产生3位随机数

						// 16位加密
						var tempspit = "";
						var strspit = angular.lowercase(str.toString());
						if (strspit.match(/^[-+]?\d*$/) == null) {// 非整数字符，对每一个字符都转换成16进制，然后拼接
							/**
							 * Unicode汉字、英文字母、数字的unicode范围
							 *   汉字：[0x4e00,0x9fa5]（或十进制[19968,40869]）
							 * 	 数字：[0x30,0x39]（或十进制[48, 57]）
							 * 	 小写字母：[0x61,0x7a]（或十进制[97, 122]）
							 * 	 大写字母：[0x41,0x5a]（或十进制[65, 90]
							 * 'a'的Unicode编码：'&#97;',charCodeAt()的值是97
							 * '码'的Unicode编码：'\u7801', new String('码').charCodeAt()的值是30721，30721的16进制表示是7801
                             */
							var s = strspit.split("");
							for (var i = 0; i < s.length; i++) {
								s[i] = s[i].charCodeAt();// 先转换成Unicode编码
								s[i] = s[i].toString(16);
								// 因为在服务器是每两位当做一个字符进行解析的，所以这里每个字符的Unicode编码范围必须在0——255之间。数字和大小写满足该要求，特殊字符则不一定，如果后续有特殊字符的要求，需要重写编码器和解码器
								if(s[i].length == 1)
									s[i] = '0' + s[i];

								tempspit = tempspit + s[i];
							}
							tempspit = tempspit + "{" + 1;// 1代表字符
						} else {// 数字直接转换成16进制
							strspit = parseInt(strspit)
									.toString(16);
							tempspit = strspit + "{" + 0// 0代表纯数字
						}

						var temp = tempspit.split("{");// 对要加密的字符转换成16进制
						var numLength = temp[0].length;// 转换后的字符长度
						numLength = numLength.toString(16);// 字符长度换算成16进制
						if (numLength.length == 1) {// 如果是1，补一个0
							numLength = "0" + numLength;
						} else if (numLength.length > 3) {// 转换后的16进制字符长度如果大于2位数，则返回，不支持
							return "";
						}
						encryptStr += numLength;
						if (temp[1] == "0") {
							encryptStr += 0;
						} else if (temp[1] == "1") {
							encryptStr += 1;
						}
						encryptStr += temp[0];
						if (encryptStr.length < 20) {// 如果小于20位，补上随机数
							// 产生三位随机数
							var numtwo = "";
							for (var i = 0; i < 20 - encryptStr.length; i++) {
								numtwo += Math.floor(Math.random() * 10);
							}
							var ran = numtwo;//产生3位随机数
							encryptStr += ran;
						}
						return encryptStr;
					}
				}
		});
});