#Stub Data Source - Base URL
#Stub Source: https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/settings-db-stub
#Couch APIs Source: https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis


#Last updated 18 Nov, 2018 (Abhijith C S)


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
echo [1/12] Creating accelerate_bills
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills
echo 
echo [2/12] Creating accelerate_cancelled_invoices
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices
echo 
echo [3/12] Creating accelerate_cancelled_orders
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders
echo 
echo [4/12] Creating accelerate_invoices
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices
echo 
echo [5/12] Creating accelerate_kot
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot
echo 
echo [6/12] Creating accelerate_menu_images
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_menu_images
echo 
echo [7/12] Creating accelerate_online_orders
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_online_orders
echo 
echo [8/12] Creating accelerate_settings
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings
echo 
echo [9/12] Creating accelerate_taps_orders
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_taps_orders
echo 
echo [10/12] Creating accelerate_users
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users
echo 
echo [11/12] Creating accelerate_tables
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_tables
echo 
echo [12/12] Creating accelerate_maverick
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_maverick




echo
echo
echo Uploading stub data to the Settings Database...
echo ...............................................
echo 
echo [1/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_BILLING_MODES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_BILLING_MODES -d "$stub_data_received"
echo
echo [2/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_BILLING_PARAMETERS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_BILLING_PARAMETERS -d "$stub_data_received"
echo
echo [3/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_BILL_INDEX.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_BILL_INDEX -d "$stub_data_received"
echo
echo [4/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_BILL_LAYOUT.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_BILL_LAYOUT -d "$stub_data_received"
echo
echo [5/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_CANCELLATION_REASONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_CANCELLATION_REASONS -d "$stub_data_received"
echo
echo [6/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_CONFIGURED_MACHINES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_CONFIGURED_MACHINES -d "$stub_data_received"
echo
echo [7/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_CONFIGURED_PRINTERS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_CONFIGURED_PRINTERS -d "$stub_data_received"
echo
echo [8/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_COOKING_INGREDIENTS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_COOKING_INGREDIENTS -d "$stub_data_received"
echo
echo [9/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_DINE_SESSIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_DINE_SESSIONS -d "$stub_data_received"
echo
echo [10/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_DISCOUNT_TYPES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_DISCOUNT_TYPES -d "$stub_data_received"
echo
echo [11/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_KOT_INDEX.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_KOT_INDEX -d "$stub_data_received"
echo
echo [12/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_KOT_RELAYING.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_KOT_RELAYING -d "$stub_data_received"
echo
echo [13/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_MASTER_MENU.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_MASTER_MENU -d "$stub_data_received"
echo
echo [14/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_MENU_CATALOG.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_MENU_CATALOG -d "$stub_data_received"
echo
echo [15/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_MENU_CATEGORIES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_MENU_CATEGORIES -d "$stub_data_received"
echo
echo [16/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_ORDER_SOURCES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_ORDER_SOURCES -d "$stub_data_received"
echo
echo [17/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_PAYMENT_MODES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_PAYMENT_MODES -d "$stub_data_received"
echo
echo [18/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_PERSONALISATIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_PERSONALISATIONS -d "$stub_data_received"
echo
echo [19/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_SAVED_COMMENTS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_SAVED_COMMENTS -d "$stub_data_received"
echo
echo [20/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_SAVED_ORDERS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_SAVED_ORDERS -d "$stub_data_received"
echo
echo [21/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_SHORTCUT_KEYS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_SHORTCUT_KEYS -d "$stub_data_received"
echo
echo [22/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_STAFF_PROFILES.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_STAFF_PROFILES -d "$stub_data_received"
echo
echo [23/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_SYSTEM_OPTIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_SYSTEM_OPTIONS -d "$stub_data_received"
echo
echo [25/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_TABLE_SECTIONS.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_TABLE_SECTIONS -d "$stub_data_received"
echo
echo [26/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_TEXT_TO_KITCHEN_LOG.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_TEXT_TO_KITCHEN_LOG -d "$stub_data_received"
echo
echo [26/26]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/stub-data/ACCELERATE_TOKEN_INDEX.json)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_settings/ACCELERATE_TOKEN_INDEX -d "$stub_data_received"



echo
echo Uploading JavaScript APIs
echo .........................

#BILL
echo
echo [1/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_bill.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bills -d "$stub_data_received"
echo
echo [2/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_bill_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-filters -d "$stub_data_received"
echo
echo [3/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_bill_summary.js.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_bills/_design/bill-filters -d "$stub_data_received"
#CANCELLED INVOICES
echo
echo [4/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_invoice_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoice-filters -d "$stub_data_received"
echo
echo [5/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_invoice_refund_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/refund-summary -d "$stub_data_received"
echo
echo [6/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_invoices.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_invoices/_design/invoices -d "$stub_data_received"
#CANCELLED ORDERS
echo
echo [7/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_order_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/order-filters -d "$stub_data_received"
echo
echo [8/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_cancelled_orders.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_cancelled_orders/_design/orders -d "$stub_data_received"
#INVOICES
echo
echo [9/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoices -d "$stub_data_received"
echo
echo [10/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-filters -d "$stub_data_received"
echo
echo [11/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_refund_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/refund-summary -d "$stub_data_received"
echo
echo [12/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/invoice-summary -d "$stub_data_received"
echo
echo [13/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_invoice_order_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_invoices/_design/order-summary -d "$stub_data_received"
#KOT
echo
echo [14/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_kot_summary.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_kot/_design/search -d "$stub_data_received"
#ONLINE ORDERS
echo
echo [15/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_online_orders_filter.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_online_orders/_design/filter-by -d "$stub_data_received"
#USERS
echo
echo [16/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_users_names.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/names -d "$stub_data_received"
echo
echo [17/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_users_search.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_users/_design/search -d "$stub_data_received"
#TABLES
echo
echo [18/18]
stub_data_received=$(curl https://raw.githubusercontent.com/Accelerate-net/vegaPOS/master/tools/couchdb-apis/couchdb_table_filters.js)
curl -X PUT http://$database_user_name:$database_user_password@$database_ip:$database_port/accelerate_tables/_design/filter-tables -d "$stub_data_received"
echo
echo
echo Finished.
echo
echo

















