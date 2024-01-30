// $FUTURE
//
// Supply - 1,000,000 $FUTURE
//
// Tokenomics:
//  - 5% Team
//  - 5% Marketing
//  - 90% Liquidity pool
//
// Features:
//  - Every day, the liquidity pool is replenished
//    and burned by 0.1% (900) $FUTURE

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

import * as Solana from "@solana/web3.js";
import * as SolanaToken from "@solana/spl-token";

const SOLANA_RPC_NAME = "devnet";
const SOLSCAN_URI = "https://solscan.io/{}/{}?cluster={}";

const FUTURE_TOTAL_SUPPLY = 1_000_000;
const FUTURE_TOKENOMICS_TEAM = (FUTURE_TOTAL_SUPPLY / 100) * 5;
const FUTURE_TOKENOMICS_MARKETING = (FUTURE_TOTAL_SUPPLY / 100) * 5;
const FUTURE_TOKENOMICS_LIQUIDITY_POOL = (FUTURE_TOTAL_SUPPLY / 100) * 90;

if (
    FUTURE_TOTAL_SUPPLY !==
    FUTURE_TOKENOMICS_TEAM +
        FUTURE_TOKENOMICS_MARKETING +
        FUTURE_TOKENOMICS_LIQUIDITY_POOL
) {
    throw Error("Total supply doesnt match with tokenomics");
}

const tokenCreator = Solana.Keypair.generate();
const mintAuthority = Solana.Keypair.generate();
const freezeAuthority = Solana.Keypair.generate();
const tokenTeam = Solana.Keypair.generate();
const tokenMarketing = Solana.Keypair.generate();

writeFileSync(
    join(__dirname, `FUTURE-${Date().valueOf()}`),
    {
        addresses: [
            {
                name: "tokenCreator",
                publicKey: tokenCreator.publicKey.toBase58(),
                secretKey: tokenCreator.secretKey
            },
            {
                name: "mintAuthority",
                publicKey: mintAuthority.publicKey.toBase58(),
                secretKey: mintAuthority.secretKey
            },
            {
                name: "freezeAuthority",
                publicKey: freezeAuthority.publicKey.toBase58(),
                secretKey: freezeAuthority.secretKey
            },
            {
                name: "tokenTeam",
                publicKey: tokenTeam.publicKey.toBase58(),
                secretKey: tokenTeam.secretKey
            },
            {
                name: "tokenMarketing",
                publicKey: tokenMarketing.publicKey.toBase58(),
                secretKey: tokenMarketing.secretKey
            }
        ]
    },
    { flag: "w" }
);

console.log(`Solana $FUTURE token creator (${SOLANA_RPC_NAME})\n\n`);

console.log(`Token creator\n
             Public key: ${tokenCreator.publicKey.toBase58()}`);
console.log(`Mint authority\n
             Public key: ${mintAuthority.publicKey.toBase58()}`);
console.log(`Freeze authority\n
             Public key: ${freezeAuthority.publicKey.toBase58()}`);
console.log(`Token team\n
             Public key: ${tokenTeam.publicKey.toBase58()}`);
console.log(`Token marketing\n
             Public key: ${tokenMarketing.publicKey.toBase58()}`);

const connection = new Solana.Connection(
    Solana.clusterApiUrl(SOLANA_RPC_NAME),
    "confirmed"
);

if (SOLANA_RPC_NAME == "devnet") {
    const airdropSignature = await connection.requestAirdrop(
        tokenCreator.publicKey,
        Solana.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
}

const mint = await SolanaToken.createMint(
    connection,
    tokenCreator,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9,
    undefined,
    undefined,
    SolanaToken.TOKEN_PROGRAM_ID
);
