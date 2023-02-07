import { Args, Query, Resolver } from '@nestjs/graphql';
import { Configuration, OpenAIApi } from 'openai';

@Resolver()
export class ChatResolver {
  @Query(() => String)
  async chat(@Args('prompt', { type: () => String }) prompt: string) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: 'text-curie-001',
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 1028,
    });
    return response.data.choices[0].text.trim();
  }
}
