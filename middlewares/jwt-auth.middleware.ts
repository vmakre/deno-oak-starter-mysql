import type { ContextState, AuthUser } from "./../types.ts";
import { validate } from "@djwt/mod.ts";

/**
 * Decode token and returns payload
 * if given token is not expired 
 * and valid with respect to given `secret`
 */
const getJwtPayload = async (token: string, secret: string): Promise<any | null> => {
  try {
    const jwtObject = await validate(token, secret);
    if (jwtObject && jwtObject.payload) {
      return jwtObject.payload;
    }
  } catch (err) {}
  return null;
};


/***
 * JWTAuth middleware
 * Decode authorization bearer token
 * and attach as an user in application context
 */
const JWTAuthMiddleware = (JWTSecret: string) => {
  return async (
    ctx: ContextState,
    next: () => Promise<void>,
  ) => {
    try {
      const authHeader = ctx.request.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace(/^bearer/i, "").trim();
        const user = await getJwtPayload(token, JWTSecret);

        if (user) {
          ctx.user = user as AuthUser;
        }
      }
    } catch (err) { }

    await next();
  };

}

export { JWTAuthMiddleware };
