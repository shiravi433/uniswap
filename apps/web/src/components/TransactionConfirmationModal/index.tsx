import { ChainId, Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import Badge from 'components/Badge'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { CHAIN_INFO, SupportedL2ChainId, useIsSupportedChainId } from 'constants/chains'
import { useCurrencyInfo } from 'hooks/Tokens'
import { Trans } from 'i18n'
import { ReactNode, useCallback, useState } from 'react'
import { AlertCircle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { isConfirmedTx, useTransaction } from 'state/transactions/hooks'
import styled, { useTheme } from 'styled-components'
import { CloseIcon, CustomLightSpinner, ExternalLink, ThemedText } from 'theme/components'
import { isL2ChainId } from 'utils/chains'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'

import { useAccount } from 'hooks/useAccount'
import { TransactionStatus } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import Circle from '../../assets/images/blue-loader.svg'
import { TransactionSummary } from '../AccountDetails/TransactionSummary'
import { ButtonLight, ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Modal from '../Modal'
import Row, { RowBetween, RowFixed } from '../Row'
import AnimatedConfirmation from './AnimatedConfirmation'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.surface1};
  border-radius: 20px;
  outline: 1px solid ${({ theme }) => theme.surface3};
  width: 100%;
  padding: 16px;
`

const BottomSection = styled(AutoColumn)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '32px 0;')};
`

const ConfirmationModalContentWrapper = styled(AutoColumn)`
  padding-bottom: 12px;
`

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  return (
    <Wrapper>
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center">
          <ThemedText.SubHeaderLarge color="neutral1" textAlign="center">
            <Trans i18nKey="transaction.confirmation.waiting" />
          </ThemedText.SubHeaderLarge>
          <ThemedText.SubHeader color="neutral1" textAlign="center">
            {pendingText}
          </ThemedText.SubHeader>
          <ThemedText.SubHeaderSmall color="neutral2" textAlign="center" marginBottom="12px">
            <Trans i18nKey="common.confirmTransaction.button" />
          </ThemedText.SubHeaderSmall>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}
function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline,
}: {
  onDismiss: () => void
  hash?: string
  chainId: number
  currencyToAdd?: Currency
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  const { connector } = useWeb3React()

  const token = currencyToAdd?.wrapped
  const logoURL = useCurrencyInfo(token)?.logoUrl ?? ''

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (!token?.symbol || !connector.watchAsset) {
      return
    }
    connector
      .watchAsset({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: logoURL,
      })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
  }, [connector, logoURL, token])

  const explorerText =
    chainId === ChainId.MAINNET ? (
      <Trans i18nKey="common.etherscan.link" />
    ) : (
      <Trans i18nKey="common.viewOnBlockExplorer" />
    )

  return (
    <Wrapper>
      <AutoColumn>
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <ArrowUpCircle strokeWidth={1} size={inline ? '40px' : '75px'} color={theme.accent1} />
        </ConfirmedIcon>
        <ConfirmationModalContentWrapper gap="md" justify="center">
          <ThemedText.MediumHeader textAlign="center">
            <Trans i18nKey="transaction.confirmation.submitted" />
          </ThemedText.MediumHeader>
          {currencyToAdd && connector.watchAsset && (
            <ButtonLight mt="12px" padding="6px 12px" width="fit-content" onClick={addToken}>
              {!success ? (
                <RowFixed>
                  <Trans
                    i18nKey="transaction.confirmation.submitted.currency.add"
                    values={{ currency: currencyToAdd.symbol }}
                  />
                </RowFixed>
              ) : (
                <RowFixed>
                  <Trans
                    i18nKey="transaction.confirmation.submitted.currency.added"
                    values={{ currency: currencyToAdd.symbol }}
                  />
                  <CheckCircle size="16px" stroke={theme.success} style={{ marginLeft: '6px' }} />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }} data-testid="dismiss-tx-confirmation">
            <ThemedText.HeadlineSmall color={theme.deprecated_accentTextLightPrimary}>
              {inline ? <Trans i18nKey="transaction.confirmation.return" /> : <Trans i18nKey="common.close" />}
            </ThemedText.HeadlineSmall>
          </ButtonPrimary>
          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <ThemedText.Link color={theme.accent1}>{explorerText}</ThemedText.Link>
            </ExternalLink>
          )}
        </ConfirmationModalContentWrapper>
      </AutoColumn>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
  headerContent,
}: {
  title: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode
  headerContent?: () => ReactNode
}) {
  return (
    <Wrapper>
      <AutoColumn gap="sm">
        <Row>
          {headerContent?.()}
          <Row justify="center" marginLeft="24px">
            <ThemedText.SubHeader>{title}</ThemedText.SubHeader>
          </Row>
          <CloseIcon onClick={onDismiss} data-testid="confirmation-close-icon" />
        </Row>
        {topContent()}
      </AutoColumn>
      {bottomContent && <BottomSection gap="16px">{bottomContent()}</BottomSection>}
    </Wrapper>
  )
}

const StyledL2Badge = styled(Badge)`
  padding: 6px 8px;
`

function L2Content({
  onDismiss,
  chainId,
  hash,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  hash?: string
  chainId: SupportedL2ChainId
  currencyToAdd?: Currency
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  const transaction = useTransaction(hash)
  const confirmed = transaction && isConfirmedTx(transaction)
  const transactionSuccess = transaction?.status === TransactionStatus.Confirmed

  // convert unix time difference to seconds
  const secondsToConfirm =
    confirmed && transaction.confirmedTime ? (transaction.confirmedTime - transaction.addedTime) / 1000 : undefined

  const info = CHAIN_INFO[chainId]

  return (
    <Wrapper>
      <AutoColumn>
        {!inline && (
          <RowBetween mb="16px">
            <StyledL2Badge>
              <RowFixed gap="sm">
                <ChainLogo chainId={chainId} />
                <ThemedText.SubHeaderSmall>{info.label}</ThemedText.SubHeaderSmall>
              </RowFixed>
            </StyledL2Badge>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          {confirmed ? (
            transactionSuccess ? (
              // <CheckCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.success} />
              <AnimatedConfirmation />
            ) : (
              <AlertCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.critical} />
            )
          ) : (
            <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
          )}
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center">
          <ThemedText.SubHeaderLarge textAlign="center">
            {!hash ? (
              <Trans i18nKey="transaction.confirmation.pending.wallet" />
            ) : !confirmed ? (
              <Trans i18nKey="transaction.confirmation.submitted" />
            ) : transactionSuccess ? (
              <Trans i18nKey="common.success" />
            ) : (
              <Trans i18nKey="common.error.label" />
            )}
          </ThemedText.SubHeaderLarge>
          <ThemedText.BodySecondary textAlign="center">
            {transaction ? <TransactionSummary info={transaction.info} /> : pendingText}
          </ThemedText.BodySecondary>
          {chainId && hash ? (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <ThemedText.SubHeaderSmall color={theme.accent1}>
                <Trans i18nKey="common.viewOnExplorer" />
              </ThemedText.SubHeaderSmall>
            </ExternalLink>
          ) : (
            <div style={{ height: '17px' }} />
          )}
          <ThemedText.SubHeaderSmall color={theme.neutral3} marginTop="20px">
            {!secondsToConfirm ? (
              <div style={{ height: '24px' }} />
            ) : (
              <div>
                <Trans i18nKey="transaction.completed.in" />
                <span style={{ fontWeight: 535, marginLeft: '4px', color: theme.neutral1 }}>
                  {secondsToConfirm} seconds 🎉
                </span>
              </div>
            )}
          </ThemedText.SubHeaderSmall>
          <ButtonPrimary onClick={onDismiss} style={{ margin: '4px 0 0 0' }}>
            {inline ? <Trans i18nKey="transaction.confirmation.return" /> : <Trans i18nKey="common.close" />}
          </ButtonPrimary>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash?: string
  reviewContent: () => ReactNode
  attemptingTxn: boolean
  pendingText: ReactNode
  currencyToAdd?: Currency
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  reviewContent,
  currencyToAdd,
}: ConfirmationModalProps) {
  const { chainId } = useAccount()
  const isSupportedChain = useIsSupportedChainId(chainId)

  if (!chainId || !isSupportedChain) {
    return null
  }

  // confirmation screen
  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      {isL2ChainId(chainId) && (hash || attemptingTxn) ? (
        <L2Content chainId={chainId} hash={hash} onDismiss={onDismiss} pendingText={pendingText} />
      ) : attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        reviewContent()
      )}
    </Modal>
  )
}
