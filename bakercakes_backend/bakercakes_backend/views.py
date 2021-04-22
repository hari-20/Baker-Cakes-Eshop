from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .firebase_db import *
import json

#checkout cart fuctionality
# @app.route("/checkout", methods=['POST'])
@csrf_exempt
def cart_checkout(request):
    if request.method == "POST":
        try:
            cart_data = json.loads(request.body)
            print(cart_data)
            checkout_res = cart_buy(cart_data)
            if checkout_res:
                return JsonResponse({"result":"success"})
            else:
                return JsonResponse({"result":"error"})
        except:
            return JsonResponse({"result":"error"})

#user contact message
# @app.route("/contactmsgform", methods=['POST'])
@csrf_exempt
def user_contactmessage(request):
    if request.method == "POST":
        try:
            message = json.loads(request.body)
            message_sent = contact_msg(message)

            if(message_sent == True):
                return JsonResponse({"result":"message sent"})
            else:
                return JsonResponse({"result":"message not sent"})
        except:
            return JsonResponse({"result":"errcontactmessage"})

# firebase backend API    
# @app.route("/usersignup", methods=['POST'])
@csrf_exempt
def user_signup(request):
    if request.method == "POST":
        try:
            user_data = json.loads(request.body)
            u_id = user_data['email']
            u_pass = user_data['pwd']
            u_mob = user_data['mobile']
            u_name = user_data['username']
            signup_res = signup(u_id, u_pass, u_name, u_mob) #signup authentication using firebase

            if(signup_res == True):
                return JsonResponse({"result":"mail sent"})
            
            elif(signup_res == "exists"):
                return JsonResponse({"result":"Account already registered"})
            
            elif(signup_res == "notvalid"):
                return JsonResponse({"result":"notvalid"})

            else:
                return JsonResponse({'result':"err"})
        
        except:
            return JsonResponse({"result":"err"})


# @app.route("/usersignin", methods=["POST"])
@csrf_exempt
def user_signin(request):
    if request.method == "POST":
        try:
            user_data = json.loads(request.body) #signin authentication using firebase
            u_id = user_data['email']
            u_pass = user_data['pwd']
            signin_res = signin(u_id, u_pass)

            if signin_res == False:
                return JsonResponse({"result":"err"})

            elif signin_res == "notverified":
                return JsonResponse({"result":"notverified"})

            elif signin_res:
                return JsonResponse({"result":"success","username":signin_res})

        except:
            return JsonResponse({"result":"err"})

# @app.route("/user-resend-verification", methods=['POST'])
@csrf_exempt
def resend_verification(request):
    if request.method == "POST":
        try:
            user_data = json.loads(request.body)
            email = user_data['email']
            password = user_data['pwd']
            resend_res = resend_mail(email,password)

            if resend_res == True:
                return JsonResponse({"result":"sent"})
            else:
                return JsonResponse({"result":"notvalid"})

        except:
            return JsonResponse({"result":"err"})

# @app.route("/user-password-reset", methods=["POST"])
@csrf_exempt
def user_password_reset(request):
    if request.method == "POST":
        user_data = json.loads(request.body)
        email = user_data['email']
        reset_res = reset_password(email)

        if reset_res:
            return JsonResponse({"result":"mail sent"})

        else:
            return JsonResponse({"result":"notfound"})

# @app.route("/savedata", methods=["POST"])
@csrf_exempt
def test_store_db(request):
    if request.method == "POST":
        data = json.loads(request.body)
        results = db.child("customer").push(data)

        return JsonResponse({"results":results})

# @app.route("/retrieve-data", methods=["GET"])
@csrf_exempt
def get_data(request):
    data = db.child("customer").order_by_child("email").equal_to("sri28vignesh@gmail.com").get()
    print(data.val())
    return JsonResponse({"result":data.val()})

@csrf_exempt
def add_product(request):
    if request.method == "POST":
        prd_data = json.loads(request.body)
        prd_res = admin_add_product(prd_data)

        if prd_res == "exists":
            return JsonResponse({"result":"exists"})
        elif prd_res:
            return JsonResponse({"result": "success"})
        else:
            return JsonResponse({"result":"error"})

@csrf_exempt
def get_all_products(request):
    try:
        data = db.child("product").order_by_child('id').get().val()
        return JsonResponse({"result":data})
    except:
        return JsonResponse({"result":"error"})

@csrf_exempt
def get_product(request,id):
    try:
        data = db.child("product").order_by_child('id').equal_to(id).get().val()
        key = ''.join(data.keys())
        return JsonResponse({"result":data[key]})
    except:
        return JsonResponse({"result":"error"})   

@csrf_exempt
def get_customer_orders(request):
    if request.method == "POST":
        resp = json.loads(request.body)
        try:
            data = db.child('orders').order_by_child('email').equal_to(resp['email']).get().val()
            if data:
                return JsonResponse({"result":data})
            else:
                return JsonResponse({"result": "no orders"})
        except:
            return JsonResponse({"result": "error"})