export interface MerkleProofStep {
  hash: string
  position: "left" | "right"
}

export interface ProvenanceLogEntry {
  blockHeight: number
  recordId: string
  timestamp: string
  action: "INITIALIZE_INVESTIGATION" | "DISPATCH_ACTION" | "EVIDENCE_SEALED" | "ADAPTIVE_PIVOT" | "CHAIN_OF_CUSTODY_EXPORT"
  investigationId: string
  endpointId?: string
  actorId: string
  previousBlockHash: string
  currentBlockHash: string
  merkleRoot: string
  signature: string
  verificationStatus: "VERIFIED" | "PENDING" | "TAMPERED"
  auditWitnessId: string
  metadataDigest: string
}

export interface MerkleVerificationResult {
  isValid: boolean
  rootHash: string
  calculatedRoot: string
  leafHash: string
  blockHeight: number
  verifiedAt: string
}
