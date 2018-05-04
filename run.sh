#!/bin/sh

echo "NODE_ENV: $NODE_ENV"
echo "BASE_URL: $BASE_URL"
echo "COMMON_URL: $COMMON_URL"

updateHost(){
  in_ip = ${1}
  in_url = ${2}
  inner_host=`cat /etc/hosts | grep ${in_url} | awk '{print $1}'`
  if [ ${inner_host} = ${in_ip} ];then
    echo "${inner_host} ${in_url} ok"
  else
    if [ ${inner_host} != "" ];then
      echo " change is ok "
    else
      inner_ip_map="${in_ip} ${in_url}"
      echo ${inner_ip_map} >> /etc/hosts
      if [ $? = 0 ]; then
        echo "${inner_ip_map} to hosts success host is `cat /etc/hosts`"
      fi
    fi
  fi
}

if [ "$NODE_ENV" == 'production' ]; then
  # updateHost 10.10.0.150 api-order.usoftmall.com
  # updateHost 10.10.0.150 api-product.usoftmall.com
  npm run build
  npm run start
else
  npm run dev-start
fi
