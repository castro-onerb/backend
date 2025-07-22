DROP VIEW ponto.vw_medical_scheduler;

CREATE OR REPLACE VIEW ponto.vw_medical_scheduler AS
SELECT
  pts.nome AS procedimento,
  ae.agenda_exames_id AS id,
  ex.situacao AS situacaoexame,
  al.situacao AS situacaolaudo,
  ae.paciente_id,
  ae.data AS data_atendimento,
  ae.faturado AS pago,
  ae.inicio,
  ae.fim,
  ae.ativo,
  ae.telefonema AS confirmado,
  ae.data_cancelamento,
  -- prioridade
  CASE
    WHEN COALESCE(ae.ordenador, '1') = '3' THEN 'urgency'
    WHEN date_part('year', age(current_date, pc.nascimento)) >= 80 THEN 'special'
    WHEN COALESCE(ae.ordenador, '1') = '2' THEN 'priority'
    ELSE 'normal'
  END AS prioridade,
  -- tipo_atendimento
  CASE
    WHEN (ae.pronto_atendimento IS NULL OR ae.pronto_atendimento = false)
      AND (ae.agenda_especialidade IS NULL OR ae.agenda_especialidade = false)
      THEN 'in_person'
    WHEN (ae.pronto_atendimento IS NOT NULL AND ae.pronto_atendimento <> false)
      OR (ae.agenda_especialidade IS NOT NULL AND ae.agenda_especialidade <> false)
      THEN 'telemedicine'
    ELSE 'unknown'
  END AS tipo_atendimento,
  -- dados do paciente
  pc.nome AS paciente_nome,
  pc.sexo,
  pc.nascimento,
  -- situação
  CASE
    WHEN ae.situacao = 'OK'
      AND (ae.cancelada IS NULL OR ae.cancelada IS FALSE)
      AND (ae.faltou_manual IS NULL OR ae.faltou_manual IS FALSE)
      AND (al.situacao = 'FINALIZADO')
      AND (ex.situacao = 'FINALIZADO')
    THEN 'finished'
    WHEN (
      (ae.situacao = 'OK' AND (
        ae.cancelada IS TRUE
        OR ae.data_cancelamento IS NOT NULL
      ))
      OR ae.situacao = 'CANCELADO'
    )
    THEN 'canceled'
    WHEN ae.situacao = 'OK'
      AND (ae.faltou_manual IS TRUE
      OR (
        ex.exames_id IS NULL
        AND al.ambulatorio_laudo_id IS NULL
        AND ae.data < current_date
      ))
    THEN 'missed'
    WHEN ae.situacao = 'OK'
      AND (al.situacao = 'AGUARDANDO')
      AND (ex.situacao = 'EXECUTANDO')
    THEN 'in_attendance'
    WHEN ae.situacao = 'OK'
      AND (al.situacao IS NULL OR al.situacao = '')
      AND (ex.situacao IS NULL OR ex.situacao = '')
      AND (ae.cancelada IS NULL OR ae.cancelada IS FALSE)
    THEN 'appoimented'
    ELSE 'free'
  END AS situacao,
  ae.medico_agenda AS agenda_do_medico,
  ae.pronto_atendimento,
  ae.situacao AS situacao_raw
FROM ponto.tb_agenda_exames ae
LEFT JOIN ponto.tb_paciente pc
  ON pc.paciente_id = ae.paciente_id
LEFT JOIN ponto.tb_exames ex
  ON ex.paciente_id = ae.paciente_id
  AND ex.agenda_exames_id = ae.agenda_exames_id
LEFT JOIN ponto.tb_ambulatorio_laudo al
  ON al.paciente_id = ae.paciente_id
  AND al.exame_id = ex.exames_id
LEFT JOIN ponto.tb_procedimento_convenio pcv
  ON pcv.procedimento_convenio_id = ae.procedimento_tuss_id
LEFT JOIN ponto.tb_procedimento_tuss pts
  ON pcv.procedimento_tuss_id = pts.procedimento_tuss_id
WHERE
  ae.situacao <> 'LIVRE'
  AND ae.paciente_id IS NOT NULL
ORDER BY pago, inicio;
