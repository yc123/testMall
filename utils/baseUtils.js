
const NULL_ARR = ['空', '没', '无', '-', '—', 'null', '#N/A']

// 获取字符串字符长度
const getRealLength = function (str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len++
    }
  }
  return len
}

// 订单号转换
export const enidfilter = (str) => {
  if (str) {
    let encryptStr = '' // 最终返回的加密后的字符串
    // 产生三位随机数
    let num = ''
    for (let i = 0; i < 3; i++) {
      num += Math.floor(Math.random() * 10)
    }
    encryptStr += num // 产生3位随机数

    // 16位加密
    let tempspit = ''
    let strspit = str.toString().toLowerCase()
    if (strspit.match(/^[-+]?\d*$/) === null) { // 非整数字符，对每一个字符都转换成16进制，然后拼接
      /**
       * Unicode汉字、英文字母、数字的unicode范围
       *汉字：[0x4e00,0x9fa5]（或十进制[19968,40869]）
       *数字：[0x30,0x39]（或十进制[48, 57]）
       *小写字母：[0x61,0x7a]（或十进制[97, 122]）
       *大写字母：[0x41,0x5a]（或十进制[65, 90]
       * 'a'的Unicode编码：'&#97;',charCodeAt()的值是97
       * '码'的Unicode编码：'\u7801', new String('码').charCodeAt()的值是30721，30721的16进制表示是7801
       */
      let s = strspit.split('')
      for (let i = 0; i < s.length; i++) {
        s[i] = s[i].charCodeAt() // 先转换成Unicode编码
        s[i] = s[i].toString(16)
        // 因为在服务器是每两位当做一个字符进行解析的，所以这里每个字符的Unicode编码范围必须在0——255之间。数字和大小写满足该要求，特殊字符则不一定，如果后续有特殊字符的要求，需要重写编码器和解码器
        if (s[i].length === 1) {
          s[i] = '0' + s[i]
        }
        tempspit = tempspit + s[i]
      }
      tempspit = tempspit + '{' + 1 // 1代表字符
    } else { // 数字直接转换成16进制
      strspit = parseInt(strspit)
        .toString(16)
      tempspit = strspit + '{' + 0 // 0代表纯数字
    }

    let temp = tempspit.split('{') // 对要加密的字符转换成16进制
    let numLength = temp[0].length // 转换后的字符长度
    numLength = numLength.toString(16) // 字符长度换算成16进制
    if (numLength.length === 1) { // 如果是1，补一个0
      numLength = '0' + numLength
    } else if (numLength.length > 3) { // 转换后的16进制字符长度如果大于2位数，则返回，不支持
      return ''
    }
    encryptStr += numLength
    if (temp[1] === '0') {
      encryptStr += 0
    } else if (temp[1] === '1') {
      encryptStr += 1
    }
    encryptStr += temp[0]
    if (encryptStr.length < 20) { // 如果小于20位，补上随机数
      // 产生三位随机数
      let numtwo = ''
      for (let i = 0; i < 20 - encryptStr.length; i++) {
        numtwo += Math.floor(Math.random() * 10)
      }
      let ran = numtwo // 产生3位随机数
      encryptStr += ran
    }
    return encryptStr
  }
}

// 获取字符串字符长度
export const getRealLen = getRealLength

// 根据字符长度剪切字符
export const cutOutString = (str, length) => {
  for (let i = 1; i <= str.length; i++) {
    if (getRealLength(str.substr(0, i)) > length) {
      str = str.substr(0, i - 1)
      break
    }
  }
  return str
}

// 根据字符长度剪切字符
export const spliceStr = (str, length) => {
  for (let i = 1; i <= str.length; i++) {
    if (getRealLength(str.substr(0, i)) > length) {
      str = str.substr(0, i - 1) + '...'
      break
    }
  }
  return str
}

// 格式化日期，返回字符串
export const formatDate = (date, fmt) => {
  if (!date) {
    return null
  }
  if (typeof date === 'string') {
    date = new Date(Date.parse(date.replace(/-/g, '/')))
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': 23, // 小时
    'm+': 59, // 分
    's+': 59, // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 检查空字符串或规定状态下空字符
export const checkNullStr = (str) => {
  // NULL_ARR.map(s => {
  //   if (str === s) {
  //     return false
  //   }
  // })
  for (let i = 0; i < NULL_ARR.length; i++) {
    if (str === NULL_ARR[i]) {
      return false
    }
  }
  return true
}

// 联系卖家
export const goLinkUser = ($this, enuu) => {
  if ($this.user.logged) {
    // $this.$http.get('/basic/enterprise/' + $this.storeInfo.enUU + '/info').then(response => {
    //   if (response.data.enTel) {
    //     $this.tel = response.data.enTel
    //     $this.showLinkBox = true
    //   } else {
    //     $this.$http.get('/basic/enterprise/' + response.data.uu + '/admin').then(response => {
    //       $this.tel = response.data.userTel
    //       $this.showLinkBox = true
    //     }, err => {
    //       $this.$message.error('获取卖家联系方式失败')
    //       console.log(err)
    //     })
    //   }
    //   $this.showLinkBox = true
    // }, err => {
    //   $this.$message.error('获取卖家联系方式失败')
    //   console.log(err)
    // })
    $this.$http.get(`/basic/enterprise/${enuu}/tels`).then(response => {
      $this.tel = response.data.data.entel || response.data.data.adminTel
      $this.showLinkBox = true
    }, err => {
      $this.$message.error('获取卖家联系方式失败')
      throw err
    })
  } else {
    $this.$router.push(`/auth/login?returnUrl=${window.location.href}`)
  }
}

// 判断字符串开头
export const startWith = function (str, s) {
  let reg = new RegExp('^' + s)
  return reg.test(str)
}

// 根据path文件名来判断文件是否是PDF文件
export const judgeIsPdf = function (path) {
  if (path) {
    return path.slice(path.lastIndexOf('.')).toLowerCase() === '.pdf'
  } else {
    return false
  }
}
// 实现深拷贝
export const deepCopy = function (target) {
  if (typeof target !== 'object') return
  // 判断目标类型，来创建返回值
  var newObj = target instanceof Array ? [] : {}
  for (var item in target) {
    // 只复制元素自身的属性，不复制原型链上的
    if (target.hasOwnProperty(item)) {
      newObj[item] = typeof target[item] === 'object' ? deepCopy(target[item]) : target[item]
    }
  }
  return newObj
}
