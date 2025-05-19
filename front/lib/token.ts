import VerificationService from '@/app/services/VerificationToken';
import { v4 as uuidv4 } from 'uuid'

export const generateVerificationToken = async (email: string) => {
    // generate random token
    const token = uuidv4();
    const expires = new Date().getTime() + 1000 * 60 * 60 * 24;


    const exisitingToken = await VerificationService.getVerificationTokenByEmail(email)

    if(exisitingToken)
    {
        await VerificationService.delelteExisitingToken(exisitingToken._id)
    }
    const data = await VerificationService.createVerificationToken({email : email ,  token  : token , expires  : new Date(expires) });

    const verificationToken = data.data; 

    return verificationToken;


}