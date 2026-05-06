export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const participant = body.participant;
    const ratings = body.results;

    if (!participant || !participant.listenerId) {
      return Response.json(
        { success: false, error: "Missing participant data" },
        { status: 400 }
      );
    }

    if (!Array.isArray(ratings) || ratings.length === 0) {
      return Response.json(
        { success: false, error: "Missing ratings data" },
        { status: 400 }
      );
    }

    await env.DB.prepare(`
      INSERT OR REPLACE INTO participants (
        participant_id, age, gender, darija_level, headphones, comments, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      participant.listenerId,
      participant.age || "",
      participant.gender || "",
      participant.darijaLevel || "",
      participant.headphones || "",
      participant.comments || "",
      new Date().toISOString()
    ).run();

    for (const row of ratings) {
      await env.DB.prepare(`
        INSERT INTO ratings (
          participant_id,
          item_id,
          text,
          shown_sample_index,
          model_id,
          file,
          naturalness,
          clarity,
          moroccan_accent,
          timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        row.participantId,
        row.itemId,
        row.text || "",
        row.shownSampleIndex,
        row.modelId,
        row.file || "",
        row.naturalness,
        row.clarity,
        row.moroccanAccent,
        row.timestamp || new Date().toISOString()
      ).run();
    }

    return Response.json({
      success: true,
      participantId: participant.listenerId,
      savedRatings: ratings.length
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || "Server error"
      },
      { status: 500 }
    );
  }
}