DBNAME=$1
USERDB=$2
PASSDB=$3
mysql -u ${USER} -p${PASSDB} -e "DROP DATABASE ${DBNAME};"
