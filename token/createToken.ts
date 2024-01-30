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

import * as Solana from '@solana/web3.js' 
import * as SolanaToken from '@solana/spl-token' 


const SOLANA_RPC_NAME = "devnet"
const SOLSCAN_URI = "https://solscan.io/"

const tokenCreator = Solana.Keypair.generate();
const mintAuthority = Solana.Keypair.generate();
const freezeAuthority = Solana.Keypair.generate();
const tokenTeam = Solana.Keypair.generate();
const tokenMarketing = Solana.Keypair.generate();

console.log(`Solana $FUTURE token creator (${SOLANA_RPC_NAME})`);
console.log(`tokenCreator: ${tokenCreator.publicKey.toBase58()}, ${tokenCreator.secretKey}`);
console.log(`mintAuthority: ${mintAuthority.publicKey.toBase58()}, ${mintAuthority.secretKey}`);
console.log(`freezeAuthority: ${freezeAuthority.publicKey.toBase58()}, ${freezeAuthority.secretKey}`);
console.log(`tokenTeam: ${tokenTeam.publicKey.toBase58()}, ${tokenTeam.secretKey}`);
console.log(`tokenMarketing: ${tokenMarketing.publicKey.toBase58()}, ${tokenMarketing.secretKey}`);
console.log(`tokenCreator: ${tokenCreator.publicKey.toBase58()}, ${tokenCreator.secretKey}`);

const connection = new Solana.Connection(Solana.clusterApiUrl(SOLANA_RPC_NAME), 'confirmed');

if (SOLANA_RPC_NAME == "devnet") {
    const airdropSignature = await connection.requestAirdrop(
        tokenCreator.publicKey,
        Solana.LAMPORTS_PER_SOL,
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
