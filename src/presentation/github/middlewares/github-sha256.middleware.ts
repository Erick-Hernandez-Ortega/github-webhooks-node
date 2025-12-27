import type { NextFunction, Request, Response } from "express";
import { envs } from "../../../config/envs";

export class GithubSha256Middleware {
  private static encoder = new TextEncoder();
  private static secret: string = envs.SECRET_TOKEN;

  static async verifyGithubSignature(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const xHubSignature: string = `${req.headers["x-hub-signature-256"]}`;
    if (xHubSignature === "undefined")
      return res.status(401).json({ error: "Invalid signature" });
    const body: string = JSON.stringify(req.body);

    const isValid: boolean = await GithubSha256Middleware.verifySignature(
      GithubSha256Middleware.secret,
      xHubSignature,
      body,
    );

    if (isValid) {
      return next();
    }

    res.status(401).json({ error: "Invalid signature" });
  }

  private static async verifySignature(
    secret: string,
    header: string,
    payload: string,
  ) {
    const parts: string[] = header.split("=");
    const sigHex: string | undefined = parts[1];

    const algorithm = { name: "HMAC", hash: { name: "SHA-256" } };

    const keyBytes: Uint8Array<ArrayBuffer> =
      GithubSha256Middleware.encoder.encode(secret);
    const extractable: boolean = false;
    const key: CryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      algorithm,
      extractable,
      ["sign", "verify"],
    );

    const sigBytes: Uint8Array<ArrayBuffer> = GithubSha256Middleware.hexToBytes(
      sigHex!,
    );
    const dataBytes: Uint8Array<ArrayBuffer> =
      GithubSha256Middleware.encoder.encode(payload);
    const equal: boolean = await crypto.subtle.verify(
      algorithm.name,
      key,
      sigBytes,
      dataBytes,
    );

    return equal;
  }

  private static hexToBytes(hex: string) {
    const len: number = hex.length / 2;
    const bytes = new Uint8Array(len);

    let index: number = 0;
    for (let i = 0; i < hex.length; i += 2) {
      const c = hex.slice(i, i + 2);
      const b = parseInt(c, 16);
      bytes[index] = b;
      index += 1;
    }
    return bytes;
  }
}
