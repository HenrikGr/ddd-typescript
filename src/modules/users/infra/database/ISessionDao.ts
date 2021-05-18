
/**
 * Session Service interface
 */
export interface ISessionDao {
  updateSession(username: string, serializedToken: string): Promise<boolean>
  getSession(username: string): Promise<any>
}
