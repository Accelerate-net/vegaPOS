
#Last updated 19 Sept, 2019 (Abhijith C S)

echo 
echo 
echo - - - - - - - - - - - - - - - - - - - - - - - -
echo Welcome to the Database APIs Clean-up Wizard
echo - - - - - - - - - - - - - - - - - - - - - - - -
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
echo Cleaning existing JavaScript APIs
echo ..................................

#BILL
echo
echo [1/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bills | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bills?rev=$stub_data_received
echo
echo [2/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-filters | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-filters?rev=$stub_data_received
echo
echo [3/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-summary?rev=$stub_data_received


#CANCELLED INVOICES
echo
echo [4/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-filters | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-filters?rev=$stub_data_received
echo
echo [5/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-summary?rev=$stub_data_received
echo
echo [6/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoices | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoices?rev=$stub_data_received


#CANCELLED ORDERS
echo
echo [7/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/order-filters | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/order-filters?rev=$stub_data_received
echo
echo [8/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/orders | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/orders?rev=$stub_data_received


#INVOICES
echo
echo [9/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoices | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoices?rev=$stub_data_received
echo
echo [10/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-filters | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-filters?rev=$stub_data_received
echo
echo [11/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/refund-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/refund-summary?rev=$stub_data_received
echo
echo [12/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-summary?rev=$stub_data_received
echo
echo [13/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/order-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/order-summary?rev=$stub_data_received


#KOT
echo
echo [14/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/kot-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/kot-summary?rev=$stub_data_received
echo
echo [15/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/kot-fetch | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/kot-fetch?rev=$stub_data_received
echo
echo [16/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/table-mapping | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/table-mapping?rev=$stub_data_received


#ONLINE ORDERS
echo
echo [17/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_online_orders/_design/filter-by | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_online_orders/_design/filter-by?rev=$stub_data_received


#USERS
echo
echo [18/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/names | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/names?rev=$stub_data_received
echo
echo [19/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/search | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/search?rev=$stub_data_received


#TABLES
echo
echo [20/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_tables/_design/filter-tables | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_tables/_design/filter-tables?rev=$stub_data_received


#TAPS ORDERS
echo
echo [21/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_taps_orders/_design/orders | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_taps_orders/_design/orders?rev=$stub_data_received


#ACTION REQUESTS
echo
echo [22/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_action_requests/_design/requests | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_action_requests/_design/requests?rev=$stub_data_received


#PRINT REQUESTS
echo
echo [23/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot_print_requests/_design/print-requests | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot_print_requests/_design/print-requests?rev=$stub_data_received


#ITEM CANCELLATIONS
echo
echo [24/24]
stub_data_received=$(curl -I http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_item_cancellations/_design/cancellation-summary | grep -Fi etag)
stub_data_received=`echo "$stub_data_received" | cut -d'"' -f 2`
echo $stub_data_received
curl -X DELETE http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_item_cancellations/_design/cancellation-summary?rev=$stub_data_received




echo
echo Uploading latest JavaScript APIs
echo .................................

#BILL
echo
echo [1/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_bill.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bills -d "$stub_data_received"
echo
echo [2/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_bill_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-filters -d "$stub_data_received"
echo
echo [3/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_bill_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-summary -d "$stub_data_received"


#CANCELLED INVOICES
echo
echo [4/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_invoice_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-filters -d "$stub_data_received"
echo
echo [5/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_invoice_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-summary -d "$stub_data_received"
echo
echo [6/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_invoices.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoices -d "$stub_data_received"


#CANCELLED ORDERS
echo
echo [7/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_order_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/order-filters -d "$stub_data_received"
echo
echo [8/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_orders.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/orders -d "$stub_data_received"


#INVOICES
echo
echo [9/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoices -d "$stub_data_received"
echo
echo [10/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-filters -d "$stub_data_received"
echo
echo [11/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_refund_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/refund-summary -d "$stub_data_received"
echo
echo [12/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-summary -d "$stub_data_received"
echo
echo [13/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_order_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/order-summary -d "$stub_data_received"


#KOT
echo
echo [14/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_kot_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/kot-summary -d "$stub_data_received"
echo
echo [15/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_kot_fetch.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/kot-fetch -d "$stub_data_received"
echo
echo [16/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_kot_table_mapping.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/table-mapping -d "$stub_data_received"


#ONLINE ORDERS
echo
echo [17/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_online_orders_filter.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_online_orders/_design/filter-by -d "$stub_data_received"


#USERS
echo
echo [18/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_users_names.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/names -d "$stub_data_received"
echo
echo [19/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_users_search.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/search -d "$stub_data_received"


#TABLES
echo
echo [20/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_table_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_tables/_design/filter-tables -d "$stub_data_received"


#TAPS ORDERS
echo
echo [21/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_taps_orders.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_taps_orders/_design/orders -d "$stub_data_received"


#ACTION REQUESTS
echo
echo [22/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_action_requests.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_action_requests/_design/requests -d "$stub_data_received"


#PRINT REQUESTS
echo
echo [23/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_print_requests.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot_print_requests/_design/print-requests -d "$stub_data_received"


#ITEM CANCELLATIONS
echo
echo [24/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_item_cancellations.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_item_cancellations/_design/cancellation-summary -d "$stub_data_received"


echo
echo
echo Finished.
echo
echo

















