
document.addEventListener('DOMContentLoaded',() => {
    const form = document.getElementById('register-form')


const inputs = {
    name : document.getElementById('name'),
    email : document.getElementById('email'),
    password : document.getElementById('password'),
    confirmPassword : document.getElementById('confirmPassword')
}

const messages = {
    name : document.getElementById('nameMessage'),
    email : document.getElementById('emailMessage'),
    password : document.getElementById('passwordMessage'),
    confirmPassword : document.getElementById('confirmPasswordMessage')
}

function validate(){
    var valid = true

    messages.name.textContent = ''
    messages.email.textContent = ''
    messages.password.textContent = ''
    messages.confirmPassword.textContent = ''

// validating name ==========================
    let namePattern = /^[a-zA-Z][a-zA-Z0-9_ ]*$/

    if(inputs.name.value.trim() === ''){
        messages.name.textContent = 'Name required'
        valid = false
    }else if(inputs.name.value.trim().length < 3){
        messages.name.textContent = 'Name must be at least 3 character'
        valid = false
    }else if(!namePattern.test(inputs.name.value)){
        messages.name.textContent = 'Dont contain any special character'
        valid = false
    }
// ============================================
// validating email ==============================
    let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(inputs.email.value.trim() === ''){
        messages.email.textContent = 'Email required'
        valid = false
    }else if(inputs.email.value && !emailPattern.test(inputs.email.value)){
        messages.email.textContent = 'Please enter a valid email'
        valid = false
    }
// ===========================================
// validating password =========================
    let passwordPattern1 = /^(?=.*[a-zA-Z])/
    let passwordPattern2 = /^(?=.*[0-9])/

    if(inputs.password.value.trim() === ''){
        messages.password.textContent = 'Password is required'
        valid = false
    }else if(inputs.password.value.length < 8){
        messages.password.textContent = 'Password must be at least 8 characters long'
        valid = false
    }else if(inputs.password.value && !passwordPattern1.test(inputs.password.value)){
        messages.password.textContent = 'Password must contain at least one letter'
    }else if(inputs.password.value && !passwordPattern2.test(inputs.password.value)){
        messages.password.textContent = 'Password must contain at least one number'
        valid = false
    }
// =================================================
// validating confirm password ====================
    if(inputs.confirmPassword.value.trim() === ''){
        messages.confirmPassword.textContent = 'Confirm password is required'
        valid = false
    }else if(inputs.password.value != inputs.confirmPassword.value){
        messages.confirmPassword.textContent = 'Password is not match'
        valid = false
    }
// ==================================================
  return valid
}


    Object.values(inputs).forEach(input => {
        input.addEventListener('input',validate)
    })

    form.addEventListener('submit',async (e) => {
        e.preventDefault()

        if(validate()){

            const name = inputs.name.value
            const email = inputs.email.value
            const password = inputs.password.value
            
            const response = await fetch('/register',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            const result = await response.json()

            if(result.status){
               await Swal.fire({
                    icon: 'success',
                    title: 'Registered Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                  })

                  window.location.href = '/'

            }else{
                Swal.fire({
                    icon: 'info',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500
                  })
            }
        }
    })
})
