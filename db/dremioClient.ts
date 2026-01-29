import axios from "axios";
import "dotenv/config";

export class DremioClient {
  private apiUrl = process.env.DREMIO_API_URL!;
  private projectId = process.env.DREMIO_PROJECT_ID!;
  private token = process.env.DREMIO_TOKEN!;

  private headers = {
    Authorization: `Bearer ${this.token}`,
    "Content-Type": "application/json",
  };

  constructor() {
    if (!this.apiUrl || !this.projectId || !this.token) {
      throw new Error("Missing Dremio Cloud env variables");
    }
  }

  // 1️⃣ Submit SQL
  async submitSQL(sql: string): Promise<string> {
    const res = await axios.post(
      `${this.apiUrl}/v0/projects/${this.projectId}/sql`,
      { sql },
      { headers: this.headers },
    );
    
    const jobId = res.data?.id;
    if (!jobId) {
      throw new Error(`No job ID returned: ${JSON.stringify(res.data)}`);
    }

    return jobId;
  }

  // 2️⃣ Wait for job completion
  async waitForJob(jobId: string): Promise<void> {
    while (true) {
      const res = await axios.get(
        `${this.apiUrl}/v0/projects/${this.projectId}/job/${jobId}`,
        { headers: this.headers },
      );

      const state = res.data.jobState;
      console.log(`Dremio job ${jobId}: ${state}`);

      if (state === "COMPLETED") return;

      if (state === "FAILED") {
        throw new Error(
          `Dremio job failed: ${JSON.stringify(res.data.errorMessage)}`,
        );
      }

      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // 3️⃣ Get results
  async getResults(jobId: string): Promise<any[]> {
    const res = await axios.get(
      `${this.apiUrl}/v0/projects/${this.projectId}/job/${jobId}/results`,
      { headers: this.headers },
    );

    return res.data.rows ?? [];
  }

  // 4️⃣ One-call helper
  async runSQL(sql: string): Promise<any[]> {
    const jobId = await this.submitSQL(sql);
    await this.waitForJob(jobId);
    return this.getResults(jobId);
  }
}
