echo 
echo 
echo - - - - - - - - - - - - - - - -
echo Customer Data Import Wizard
echo - - - - - - - - - - - - - - - -
echo 
echo 1. Please enter CouchDB Admin Name:
read database_user_name
echo 2. Please enter CouchDB Admin Password:
read database_user_password
echo 3. Please enter CouchDB IP Address [Default is 127.0.0.1]:
read database_ip
echo 4. Please enter CouchDB Port Number [Default is 5984]:
read database_port
echo 
echo
echo Connecting to Cloud Server...
echo ...............................
a=0
max=10000
while [ $a -lt $max ]
do
echo $a
a=`expr $a + 1`
echo [$a/$max]
stub_data_received=$(curl https://zaitoon.online/services/posimportcontacts.php)
curl -H 'Content-Type: application/json' -X POST http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_users -d "$stub_data_received"
echo
done
echo
echo Finished.
echo
echo
