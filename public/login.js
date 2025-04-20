
document.addEventListener('DOMContentLoaded',() => {

    const form = document.getElementById('login-form')

    const inputs = {
        email : document.getElementById('email'),
        password : document.getElementById('password')
    }

    const messages = {
        email : document.getElementById('emailMessage'),
        password : document.getElementById('passwordMessage')
    }

    function validate(){
        let valid = true

        messages.email.textContent = ''
        messages.password.textContent = ''

        if(inputs.email.value.trim() === ''){
            messages.email.textContent = 'Email required'
            valid = false
        }

        if(inputs.password.value.trim() === ''){
            messages.password.textContent = 'Password required'
            valid = false
        }

        return valid
    }

    Object.values(inputs).forEach(input => {
        input.addEventListener('input',validate)
    })

    form.addEventListener('submit',async(e) => {
        e.preventDefault()

        if(validate()){

            const email = inputs.email.value
            const password = inputs.password.value

            const response = await fetch('/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
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
                if(result.password){
                    messages.password.textContent = result.message
                }else{
                    await Swal.fire({
                        icon: 'info',
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            }
        }
    })
})