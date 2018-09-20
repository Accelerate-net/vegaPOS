#Stub Data Source - Base URL
#Stub Source: https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub
#Couch APIs Source: https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis

echo 
echo 
echo - - - - - - - - - - - - - - - - - - - 
echo Welcome to the Database Setup Wizard
echo - - - - - - - - - - - - - - - - - - - 
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
echo Creating the 8 Databases...
echo ...........................
echo 
echo [1/8] Creating zaitoon_bills
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_bills
echo 
echo Creating zaitoon_cancelled_invoices
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_invoices
echo 
echo [2/8] Creating zaitoon_cancelled_orders
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_orders
echo 
echo [3/8] Creating zaitoon_invoices
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_invoices
echo 
echo [4/8] Creating zaitoon_kot
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_kot
echo 
echo [5/8] Creating zaitoon_menu_images
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_menu_images
echo 
echo [6/8] Creating zaitoon_online_orders
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_online_orders
echo 
echo [7/8] Creating zaitoon_settings
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings
echo 
echo [8/8] Creating zaitoon_users
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_users



echo
echo
echo Uploading stub data to the Settings Database...
echo ...............................................
echo 
echo [1/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_BILLING_MODES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_BILLING_MODES -d "$stub_data_received"
echo
echo [2/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_BILLING_PARAMETERS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_BILLING_PARAMETERS -d "$stub_data_received"
echo
echo [3/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_BILL_INDEX.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_BILL_INDEX -d "$stub_data_received"
echo
echo [4/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_BILL_LAYOUT.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_BILL_LAYOUT -d "$stub_data_received"
echo
echo [5/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_CANCELLATION_REASONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_CANCELLATION_REASONS -d "$stub_data_received"
echo
echo [6/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_CONFIGURED_MACHINES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_CONFIGURED_MACHINES -d "$stub_data_received"
echo
echo [7/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_CONFIGURED_PRINTERS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_CONFIGURED_PRINTERS -d "$stub_data_received"
echo
echo [8/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_COOKING_INGREDIENTS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_COOKING_INGREDIENTS -d "$stub_data_received"
echo
echo [9/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_DINE_SESSIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_DINE_SESSIONS -d "$stub_data_received"
echo
echo [10/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_DISCOUNT_TYPES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_DISCOUNT_TYPES -d "$stub_data_received"
echo
echo [11/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_KOT_INDEX.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_KOT_INDEX -d "$stub_data_received"
echo
echo [12/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_MASTER_MENU.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_MASTER_MENU -d "$stub_data_received"
echo
echo [13/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_MENU_CATEGORIES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_MENU_CATEGORIES -d "$stub_data_received"
echo
echo [14/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_ORDER_SOURCES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_ORDER_SOURCES -d "$stub_data_received"
echo
echo [15/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_PAYMENT_MODES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_PAYMENT_MODES -d "$stub_data_received"
echo
echo [16/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_PERSONALISATIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_PERSONALISATIONS -d "$stub_data_received"
echo
echo [17/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_SAVED_COMMENTS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_SAVED_COMMENTS -d "$stub_data_received"
echo
echo [18/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_SAVED_ORDERS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_SAVED_ORDERS -d "$stub_data_received"
echo
echo [19/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_SHORTCUT_KEYS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_SHORTCUT_KEYS -d "$stub_data_received"
echo
echo [20/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_STAFF_PROFILES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_STAFF_PROFILES -d "$stub_data_received"
echo
echo [21/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_SYSTEM_OPTIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_SYSTEM_OPTIONS -d "$stub_data_received"
echo
echo [22/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_TABLES_MASTER.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_TABLES_MASTER -d "$stub_data_received"
echo
echo [23/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_TABLE_SECTIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_TABLE_SECTIONS -d "$stub_data_received"
echo
echo [24/24]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/settings-db-stub/ZAITOON_TOKEN_INDEX.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_settings/ZAITOON_TOKEN_INDEX -d "$stub_data_received"



echo
echo Uploading JavaScript APIs
echo .........................

#BILL
echo
echo [1/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_bill.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_bills/_design/bills -d "$stub_data_received"
echo
echo [2/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_bill-filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_bills/_design/bill-filters -d "$stub_data_received"
#CANCELLED INVOICES
echo
echo [3/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_cancelled_invoice_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_invoices/_design/invoice-filters -d "$stub_data_received"
echo
echo [4/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_cancelled_invoice_refund_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_invoices/_design/refund-summary -d "$stub_data_received"
echo
echo [5/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_cancelled_invoices.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_invoices/_design/invoices -d "$stub_data_received"
#CANCELLED ORDERS
echo
echo [6/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_cancelled_order_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_orders/_design/order-filters -d "$stub_data_received"
echo
echo [7/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_cancelled_orders.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_cancelled_orders/_design/orders -d "$stub_data_received"
#INVOICES
echo
echo [8/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_invoice.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_invoices/_design/invoices -d "$stub_data_received"
echo
echo [9/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_invoice_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_invoices/_design/invoice-filters -d "$stub_data_received"
echo
echo [10/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_invoice_refund_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_invoices/_design/refund-summary -d "$stub_data_received"
echo
echo [11/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_invoice_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_invoices/_design/invoice-summary -d "$stub_data_received"
#ONLINE ORDERS
echo
echo [12/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_online_orders_filter.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_online_orders/_design/filter-by -d "$stub_data_received"
#USERS
echo
echo [13/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_users_names.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_users/_design/names -d "$stub_data_received"
echo
echo [14/14]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/data/backup/couchdb-apis/couchdb_users_search.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/zaitoon_users/_design/search -d "$stub_data_received"
echo
echo
echo Finished.
echo
echo

















