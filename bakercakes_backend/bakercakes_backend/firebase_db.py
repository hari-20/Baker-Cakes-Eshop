import pyrebase
import datetime

firebaseConfig = {
    "apiKey": "AIzaSyB4nrgTXuRwfRpLEzCtey_MrxQYyTM9WX8",
    "authDomain": "bakercakes-2652b.firebaseapp.com",
    "databaseURL": "https://bakercakes-2652b-default-rtdb.firebaseio.com",
    "projectId": "bakercakes-2652b",
    "storageBucket": "bakercakes-2652b.appspot.com",
    "messagingSenderId": "944098704511",
    "appId": "1:944098704511:web:1c6409b735af27fc86d34a",
    "measurementId": "G-F6VELR34MC"
}

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()  #Firebase authentication
db = firebase.database()   #Firebase database


def signup(email, password, u_name, mobile_num): 
    try:
        create_user = auth.create_user_with_email_and_password(email, password)
    except:
        return "exists"

    try:
        # user token expires every 1 hour:
        create_user = auth.refresh(create_user['refreshToken'])
        
        verify_mail = auth.send_email_verification(create_user['idToken']) #send email verification
        user_info = auth.get_account_info(create_user['idToken']) #Fetching Account info for localId
        
        uId = user_info['users'][0]['localId'] #localId
        data = {'email':email, 'username':u_name, 'mobile': str(mobile_num)}
        results = db.child("customer").child(uId).set(data) #Storing userdata to firebase realtime database

        if(verify_mail['kind']!= None):
            return True
        else:
            return "notvalid"
    except:
        return "err"

def signin(email, password):
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        # user token expires every 1 hour:
        user = auth.refresh(user['refreshToken'])
        user_info = auth.get_account_info(user['idToken'])
        emailVerified = user_info['users'][0]['emailVerified']
        if emailVerified == True:
            uId = user_info['users'][0]['localId']
            user_name = db.child("customer").child(uId).child("username").get().val()
            return user_name
        else:
            return "notverified" 
    except:
        return False


def resend_mail(email, password):
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        # user token expires every 1 hour:
        user = auth.refresh(user['refreshToken'])
        verify_mail = auth.send_email_verification(user['idToken'])
        #print("email verification: ",verify_user)
        if(verify_mail['kind']!= None):
            return True
        else:
            return "notvalid"
    except:
        return "notvalid"

def reset_password(email):
    try:
        user = auth.send_password_reset_email(email)
        return True
    except:
        return False

def generateOrderID():
    try:
        last_record = db.child("orders").order_by_key().limit_to_last(1).get().val()
        last_id = "".join(last_record.keys())
        order_num  = int(last_id[10:])
        order_num += 1

        date = datetime.datetime.now()
        date_format = date.strftime("%Y%m%d") #yyyymmdd
        order_id = "OD"+ date_format + str(order_num)
        return order_id

    except:
        # print("Hello exception")
        date = datetime.datetime.now()
        date_format = date.strftime("%Y%m%d") #yyyymmdd
        order_id = "OD"+ date_format + "1"
        return order_id


#cart data
def cart_buy(cart_data):
    try:
        ordered_products = cart_data['products_ordered']
        for prd_id in ordered_products.keys():
            prd_order = cart_data.copy()
            prd_order['product_desc'] = ordered_products[prd_id]
            prd_order.pop('products_ordered') 
            prd_order.pop('totalCost')
            order_id = generateOrderID()
            prd_order['oid'] = order_id
            prd_order['odate'] = date = str(datetime.datetime.now())
            results = db.child("orders").child(order_id).set(prd_order) #Storing user ordered cart data to firebase realtime database
            
        return True
            
    except:
        return False





#contact message
def contact_msg(contact_message):
    try:
        message_email = contact_message['contact_Email']
        reason_message = contact_message['contact_Message']
        #user_name_customer = contact_message['contact_name']
        msgdata = {'email':message_email, 'message':reason_message}
        results = db.child("messages").push(msgdata) 

        return True
    except:
        return False


#Adding a product by admin
def admin_add_product(data):
    try:
        is_prd = db.child("product").order_by_child('id').equal_to(data['id']).get().val()
        if is_prd != None:
            return "exists"
        else:
            results = db.child("product").child(data['id']).set(data)
            return True
    except:
        return False
