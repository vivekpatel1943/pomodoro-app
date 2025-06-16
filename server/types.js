import zod from 'zod';

// user router
export const userSignupInput = zod.object({
    name : zod.string().trim().min(1, { message: "Required" }),
    email:zod.string().trim().min(1,{message : "Required"}),
    password : zod.string().trim().min(1,{message:"Required"})
})

export const userSigninInput = zod.object({
    email : zod.string().trim().min(1,{message:"Required"}),
    password : zod.string().trim().min(1,{message:"Required"})    
})

export const timeInput = zod.object({
    timeInMinutes : zod.number()
})