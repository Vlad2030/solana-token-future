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

const tokenCreator = Solana.Keypair.generate();
const mintAuthority = Solana.Keypair.generate();
const freezeAuthority = Solana.Keypair.generate();
const tokenTeam = Solana.Keypair.generate();
const tokenMarketing = Solana.Keypair.generate();

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
