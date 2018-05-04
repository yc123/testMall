<template>
  <div>
    <div id="brandsList" class="container">
      <div id="brands">
        <div v-for="(brands, initial) in brandList" class="row container brands-page">
          <div class="brands-title">{{initial}}</div>
          <div class="hr-blue"></div>
          <div class="row brands-body">
            <div class="simplebrand" v-for="brand in brands">
              <div class="brand-name">
                <nuxt-link :to="`/product/brand/${brand.uuid}/`">
                  <span>{{brand.nameEn}}</span>
                </nuxt-link>
              </div>
              <div>
                <nuxt-link :to="`/product/brand/${brand.uuid}/`" v-if="brand.nameEn!=brand.nameCn">
                  <span class="brand-name-cn">{{brand.nameCn}}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// function sortList(letter) {
//   return function(a, b) {
//     var value1 = a[letter]
//     var value2 = b[letter]
//     if (value1 > value2) {
//       return 1
//     } else if (value1 < value2) {
//       return -1
//     } else {
//       return 0
//     }
//   }
// }
function deepCopy(obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  var newobj = {}
  for (var attr in obj) {
    newobj[attr] = deepCopy(obj[attr])
  }
  return newobj
}

export default {
  name: 'brandList',
  computed: {
    brandList() {
      var brandsList = deepCopy(this.$store.state.product.brand.brandList.data)
      // console.log(this.$store.state.product.brand.brandList.data)
      // if (brandsList) {
      //   for (let i in brandsList) {
      //     brandsList[i] = brandsList[i].sort(sortList('nameEn'))
      //   }
      // }
      let temp = {}
      let keys = []
      for (let key in brandsList) {
        keys.push(key)
      }
      keys = keys.sort()
      for (let i = 0; i < keys.length; i++) {
        temp[keys[i]] = brandsList[keys[i]]
      }
      return temp
    }
  }
}
</script>

<style>
/** brandList*/
#brandsList {
  clear: both;
  width: 1190px;
  padding: 0;
}

#brandsList .hr-blue {
  border-bottom: 2px solid #6493ff;
  border-right: 0;
  border-top: 0;
  border-left: 0;
  width: 100%;
}

#brandsList .initials {
  margin-top: 3px;
}

#brandsList .row {
  margin: 20px 0;
}

#brandsList .row .initial {
  display: inline-block;
  margin: 0 5px;
  font-size: 16px;
  color: #787878;
}

#brandsList .row .initial:hover a,
#brandsList .row li.initial.active a {
  color: #5078cb;
  font-weight: bold;
  cursor: pointer;
}

#brandsList .row .initial-active {
  color: #5078cb;
  font-weight: bold;
}
#brandsList .row .initial a {
  font-size: 16px;
  color: #787878;
}
#brandsList .row .initial:hover a {
  color: #5078cb;
  font-weight: bold;
  cursor: pointer;
}
#brands .container {
  width: 1190px;
  padding: 0px;
}

#brands .row .brands-title {
  width: 70px;
  height: 30px;
  padding-top: 5px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  background-color: #6493ff;
}

#brands .row .brands-body {
  margin-bottom: 30px;
  font-size: 14px;
  color: #323232;
}

#brands .simplebrand {
  height: 30px;
  margin: 13px 0px;
  width: 25%;
  float: left;
}

#brands .simplebrand a {
  color: #323232;
  text-decoration: none;
}

#brands .simplebrand:hover a {
  color: #6493ff;
  font-weight: bold;
}

#brands .simplebrand .brand-name {
  margin-bottom: 2px;
}

#brands .simplebrand .brand-name-cn {
  font-size: 12px;
}

#brandsList ul {
  padding-left: 0px;
}

#brandsList ul li {
  list-style: none;
}
#carousel li {
  width: 12px;
  height: 12px;
  margin: 3px;
}
</style>
