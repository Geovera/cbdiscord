DBNAME=$1
USERDB=$2
PASSDB=$3

./deleteDatabase.sh ${DBNAME} ${USERDB} ${PASSDB}

./createDatabase.sh -d=${DBNAME} -u=${USERDB} -p=${PASSDB}
